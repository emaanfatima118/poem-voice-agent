export interface BaselineSignals {
  seo?: number;
  content?: number;
  social?: number;
  lead_gen?: number;
  lead_forms_detected?: number;
  dynamic_forms_ratio?: number;
  analytics?: number;
  analytics_scripts?: number;
  email_marketing?: number;
  paid_ads?: number;
  paid_scripts_detected?: number;
  brand?: number;
  ux_score?: number;
  responsive_score?: number;
  modern_seo_score?: number;
}

export function computeBaselineScore(
  baselineSignals: BaselineSignals,
  debug: boolean = false
): [number, string] {
  // Section weights
  const allWeights: Record<string, number> = {
    seo: 0.2,
    content: 0.18,
    social: 0.08,
    lead_gen: 0.12,
    analytics: 0.12,
    email_marketing: 0.06,
    paid_ads: 0.04,
    brand: 0.2,
  };

  const activeKeys = Object.keys(allWeights).filter((key) => key in baselineSignals);
  const totalWeight = activeKeys.reduce((sum, k) => sum + allWeights[k], 0);
  const weights: Record<string, number> = {};
  activeKeys.forEach((k) => {
    weights[k] = allWeights[k] / totalWeight;
  });

  const adjusted = { ...baselineSignals };

  // Normalize overestimated sections
  if ('lead_gen' in adjusted) {
    const leadForms = adjusted.lead_forms_detected ?? adjusted.lead_gen ?? 0;
    const dynamicFactor = adjusted.dynamic_forms_ratio ?? 0;
    const leadFactor = 1 - 0.6 * dynamicFactor;
    adjusted.lead_gen = Math.max(0, Math.min(1, leadForms * leadFactor));
  }

  // Paid Ads: cap at realistic presence threshold
  if ('paid_ads' in adjusted) {
    let paidDetected = adjusted.paid_scripts_detected ?? adjusted.paid_ads ?? 0;
    if (paidDetected > 0.7) {
      paidDetected = 0.7 + 0.3 * (1 - paidDetected);
    }
    adjusted.paid_ads = Math.max(0, Math.min(1, paidDetected));
  }

  // Analytics: if too many trackers or scripts, penalize saturation
  if ('analytics' in adjusted) {
    let analyticsVal = adjusted.analytics ?? 0;
    const trackerCount = adjusted.analytics_scripts ?? 0;
    if (trackerCount > 8) {
      analyticsVal *= 0.85;
      if (debug) console.log(`[DEBUG] 📊 Too many trackers (${trackerCount}) -> Analytics penalized ×0.85`);
    }
    adjusted.analytics = Math.max(0, Math.min(1, analyticsVal));
  }

  // Ensure all values are within [0,1]
  activeKeys.forEach((k) => {
    const key = k as keyof BaselineSignals;
    adjusted[key] = Math.max(0, Math.min(1, (adjusted[key] as number) ?? 0));
  });

  // Weighted sum
  let weightedSum = 0;
  if (debug) console.log('[DEBUG] 🧮 Weighted contributions:');
  activeKeys.forEach((k) => {
    const val = (adjusted[k as keyof BaselineSignals] as number) ?? 0;
    const w = weights[k];
    const contribution = val * w * 100;
    weightedSum += contribution;
    if (debug) console.log(`   ${k}: ${val.toFixed(2)} × ${w.toFixed(3)} = ${contribution.toFixed(2)}`);
  });

  // Penalties
  let penalty = 1.0;
  const ux = adjusted.ux_score ?? 1.0;
  if (ux < 0.3) {
    penalty *= 0.85;
    if (debug) console.log('[DEBUG] ⚠️ UX very poor -> ×0.85');
  } else if (ux < 0.4) {
    penalty *= 0.9;
    if (debug) console.log('[DEBUG] ⚠️ UX moderate -> ×0.9');
  }

  // Weak SEO + content combo
  if ('seo' in adjusted && 'content' in adjusted) {
    const seoVal = adjusted.seo ?? 0;
    const contentVal = adjusted.content ?? 0;
    if (seoVal < 0.25 && contentVal < 0.35) {
      penalty *= 0.9;
      if (debug) console.log('[DEBUG] ⚠️ Weak SEO+Content -> ×0.9');
    }
  }

  // Boosts
  let boost = 0;
  if (ux > 0.8) {
    boost += 1.0;
    if (debug) console.log('[DEBUG] ✅ UX boost +1.0');
  }
  if ((adjusted.responsive_score ?? 0) > 0.9) {
    boost += 1.0;
    if (debug) console.log('[DEBUG] ✅ Responsive boost +1.0');
  }
  if ((adjusted.modern_seo_score ?? 0) > 0.6) {
    boost += 0.5;
    if (debug) console.log('[DEBUG] ✅ Modern SEO boost +0.5');
  }

  // Diminish boosts for strong sites
  const preBoostScore = weightedSum * penalty;
  if (preBoostScore > 90) {
    boost *= 0.3;
  } else if (preBoostScore > 80) {
    boost *= 0.6;
  }

  // Prevent extra bonuses above 95 (match Python logic)
  let rawScore = preBoostScore + boost;
  if (rawScore > 95) {
    rawScore = Math.min(rawScore, 95);
    if (debug) console.log('[DEBUG] 🧩 Capped strong site at 95');
  }

  const finalScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  // Adaptive confidence (Python version)
  const coreKeys = ['seo', 'lead_gen', 'analytics'].filter((k) => activeKeys.includes(k));
  const coreAvg =
    coreKeys.length > 0
      ? coreKeys.reduce((sum, k) => sum + ((adjusted[k as keyof BaselineSignals] as number) ?? 0), 0) / coreKeys.length
      : activeKeys.reduce((sum, k) => sum + ((adjusted[k as keyof BaselineSignals] as number) ?? 0), 0) /
        Math.max(activeKeys.length, 1);

  let confidence: string;
  if (coreAvg > 0.65) {
    confidence = 'High';
  } else if (coreAvg > 0.35) {
    confidence = 'Medium';
  } else {
    confidence = 'Low';
  }

  if (debug) {
    console.log(
      `[DEBUG] Weighted=${weightedSum.toFixed(2)}, Penalty=${penalty.toFixed(2)}, Boost=${boost.toFixed(2)}, Final=${rawScore.toFixed(2)}`
    );
    console.log(
      `[DEBUG] Confidence=${confidence} (core_avg=${coreAvg.toFixed(2)}, based on ${coreKeys.length > 0 ? coreKeys.length : activeKeys.length} metrics)`
    );
  }

  return [finalScore, confidence];
}

export function scoreStabilizer(
  newScore: number,
  prevEntry: any | null,
  confidence: string = 'High'
): number {
  if (!prevEntry) {
    if (console) console.log(`[STABILIZER] 🆕 No previous entry, returning ${newScore}`);
    return Math.round(newScore);
  }

  if (console) {
    console.log('[STABILIZER] 🔍 Received prevEntry:', {
      has_overall_score: 'overall_score' in prevEntry,
      has_stabilized_score: 'stabilized_score' in prevEntry,
      overall_score: prevEntry.overall_score,
      stabilized_score: prevEntry.stabilized_score,
      baseline_confidence: prevEntry.baseline_confidence,
      keys: Object.keys(prevEntry)
    });
  }

  const prevScore = prevEntry.overall_score ?? prevEntry.stabilized_score ?? newScore;
  const prevConfidence = prevEntry.baseline_confidence || prevEntry.confidence || 'High';
  const delta = newScore - prevScore;

  if (console) {
    console.log(`[STABILIZER] 📊 Input: Prev=${prevScore} (${prevConfidence}), New=${newScore} (${confidence}), Δ=${delta}`);
  }

  // Detect if previous audit had errors/timeout (Low confidence with extreme score)
  const prevHadError = prevConfidence === 'Low' && (prevScore < 40 || Math.abs(delta) > 30);
  
  if (prevHadError && confidence === 'High') {
    if (console) {
      console.log(`[STABILIZER] 🔄 Previous audit error detected (Low confidence, extreme score). Ignoring prev=${prevScore}, using new=${newScore}`);
    }
    return Math.round(newScore);
  }

  // If current audit has Low confidence, trust previous more
  if (confidence === 'Low' && prevConfidence === 'High' && Math.abs(delta) > 20) {
    if (console) {
      console.log(`[STABILIZER] ⚠️ Current audit Low confidence with large Δ=${delta}. Trusting prev=${prevScore} more`);
    }
    // Use minimal blend (90% previous, 10% new)
    const stabilized = prevScore * 0.9 + newScore * 0.1;
    return Math.round(stabilized);
  }

  // If score is very close (±2 points) and both High confidence, lock it to prevent drift
  if (Math.abs(delta) <= 2 && confidence === 'High' && prevConfidence === 'High') {
    if (console) console.log(`[STABILIZER] 🔒 Score LOCKED (Δ=${delta} within ±2) → Final=${prevScore}`);
    return prevScore;
  }

  // Confidence thresholds
  let maxDrop: number, maxRise: number, blendWeight: number;
  if (confidence === 'High') {
    // Reduced blend weight to 0.7 for more stability, allow max rise of 15
    [maxDrop, maxRise, blendWeight] = [12, 15, 0.7];
  } else if (confidence === 'Medium') {
    [maxDrop, maxRise, blendWeight] = [18, 25, 0.8];
  } else {
    // Low
    [maxDrop, maxRise, blendWeight] = [25, 25, 0.65];
  }

  // Clamp excessive change
  let adjustedNewScore = newScore;
  if (delta < -maxDrop) {
    if (console) console.log(`[STABILIZER] ⚠️ Drop CLAMPED: ${delta} → ${-maxDrop} (max allowed drop)`);
    adjustedNewScore = prevScore - maxDrop;
  } else if (delta > maxRise) {
    if (console) console.log(`[STABILIZER] ⚠️ Rise CLAMPED: ${delta} → ${maxRise} (max allowed rise)`);
    adjustedNewScore = prevScore + maxRise;
  }

  // Smoother blend (favor stability)
  const stabilized = prevScore * (1 - blendWeight) + adjustedNewScore * blendWeight;

  const finalScore = Math.round(Math.min(100, Math.max(0, stabilized)));

  if (console) {
    console.log(
      `[STABILIZER] ✅ Blended (weight=${blendWeight}) → Raw=${stabilized.toFixed(2)} → Final=${finalScore}`
    );
  }

  return finalScore;
}

export function computeSectionAnchors(
  baselineSignals: BaselineSignals & Record<string, any>,
  stabilizedScore: number,
  debug: boolean = false
): Record<string, { pre_score: number; confidence: string }> {
  const mapping: Record<string, string> = {
    brand_messaging: 'brand',
    website_seo: 'seo',
    content_marketing: 'content',
    social_media: 'social',
    email_marketing: 'email_marketing',
    paid_advertising: 'paid_ads',
    lead_generation: 'lead_gen',
    analytics_and_tracking: 'analytics',
  };

  // Detect saturation (many signals at ~1.0)
  const saturationKeys = ['seo', 'content', 'social', 'analytics', 'lead_gen', 'email_marketing', 'paid_ads', 'brand'];
  const vals = saturationKeys.map((k) => parseFloat(String(baselineSignals[k] ?? 0.0)));
  const saturation = vals.filter((v) => v >= 0.99).length / Math.max(1, vals.length);

  let saturationMode: string;
  let globalPenaltyFactor: number;
  let anchorTrust: number;

  if (saturation > 0.6) {
    saturationMode = 'high';
    globalPenaltyFactor = 0.85;
    anchorTrust = 0.45;
  } else if (saturation > 0.35) {
    saturationMode = 'medium';
    globalPenaltyFactor = 0.92;
    anchorTrust = 0.55;
  } else {
    saturationMode = 'low';
    globalPenaltyFactor = 1.0;
    anchorTrust = 0.65;
  }

  const anchors: Record<string, { pre_score: number; confidence: string }> = {};

  for (const [sec, key] of Object.entries(mapping)) {
    // Raw signal (0..1)
    const v = parseFloat(String(baselineSignals[key] ?? 0.0));

    // Convert "presence" -> "quality" using mild diminishing returns
    const quality = v * (0.6 + 0.4 * v);

    // Base score derived from quality but centered toward stabilized_score
    const baseMin = Math.max(20, Math.round(stabilizedScore * 0.45));
    const baseMax = Math.min(95, Math.round(stabilizedScore * 0.95 + 5));
    let base = Math.round(baseMin + quality * (baseMax - baseMin));

    // Per-section targeted penalties (bounded)
    if (key === 'seo') {
      if (!baselineSignals.title_present) {
        base = Math.round(base * 0.78 * globalPenaltyFactor);
      }
      if (!baselineSignals.meta_description_present) {
        base = Math.round(base * 0.85 * globalPenaltyFactor);
      }
      if ((baselineSignals.h1_count ?? 0) === 0) {
        base = Math.round(base * 0.9 * globalPenaltyFactor);
      }
    } else if (key === 'lead_gen') {
      const forms = baselineSignals.forms_count ?? 0;
      if (forms === 0) {
        base = Math.round(base * 0.6 * globalPenaltyFactor);
      } else if (forms < 2) {
        base = Math.round(base * 0.78 * globalPenaltyFactor);
      }
      if ((baselineSignals.dynamic_forms_ratio ?? 0) > 0.4) {
        base = Math.round(base / 0.95);
      }
    } else if (key === 'analytics') {
      if ((baselineSignals.analytics_count ?? 0) === 0) {
        base = Math.round(base * 0.62 * globalPenaltyFactor);
      } else if ((baselineSignals.analytics_scripts ?? 0) > 8) {
        base = Math.round(base * 0.9);
      }
    } else if (key === 'paid_ads') {
      if ((baselineSignals.paid_ads_count ?? 0) === 0) {
        base = Math.round(base * 0.7 * globalPenaltyFactor);
      }
    } else if (key === 'social') {
      if ((baselineSignals.social_profiles_count ?? 0) === 0) {
        base = Math.round(base * 0.72 * globalPenaltyFactor);
      }
    } else if (key === 'content') {
      if ((baselineSignals.blog_count ?? 0) === 0) {
        base = Math.round(base * 0.78 * globalPenaltyFactor);
      }
    } else if (key === 'email_marketing') {
      if ((baselineSignals.email_capture ?? 0) === 0) {
        base = Math.round(base * 0.8 * globalPenaltyFactor);
      }
    } else if (key === 'brand') {
      base = Math.round(base * 0.95);
    }

    // Bound the anchor relative to stabilized_score
    const floor = Math.round(Math.max(10, stabilizedScore * 0.48));
    const ceiling = Math.round(Math.min(99, stabilizedScore + 6));
    base = Math.max(floor, Math.min(base, ceiling));

    // Blend the anchor more toward stabilized_score if saturation is high
    const preScore = Math.round(base * anchorTrust + stabilizedScore * (1 - anchorTrust));

    const confidence = quality >= 0.75 ? 'High' : quality >= 0.4 ? 'Medium' : 'Low';

    anchors[sec] = {
      pre_score: preScore,
      confidence,
    };

    if (debug) {
      console.log(
        `[DEBUG][ANCHOR] ${sec}: v=${v.toFixed(3)}, quality=${quality.toFixed(3)}, ` +
          `base=${base}, floor=${floor}, ceiling=${ceiling}, pre_score=${preScore}, conf=${confidence}`
      );
    }
  }

  return anchors;
}
