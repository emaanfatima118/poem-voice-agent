"use client"

import React, { useState } from "react";
import { Card } from "./ui/card";
import { Check } from "lucide-react";

function PricingCard({
  badge,
  title,
  price,
  period = "/month",
  features,
  onSelect,
  isSelected = false,
}) {
  const [hovered, setHovered] = useState(false);
  const active = isSelected || hovered;

  return (
<Card
  onClick={onSelect}
  onMouseEnter={() => setHovered(true)}
  onMouseLeave={() => setHovered(false)}
  className={`mx-auto w-[90%] sm:w-full p-4 pb-6 sm:p-6 md:p-8 lg:p-10 border-2 border-gray-200 cursor-pointer rounded-2xl transition-all duration-300
    ${active
      ? "text-white border-purple-600 bg-[linear-gradient(180deg,#6218DF_0%,#FEFEFF_277.7%)]"
      : "bg-white border-gray-200 text-gray-900 hover:border-purple-600"}`}
>

      {/* Badge (tag) or reserved space for uniformity */}
      <div className="h-8 mb-1">
        {badge && (
          <div
            // Badge appearance driven by `active` and badge type
            className={`w-fit px-3 sm:px-4 py-1 sm:py-1.5 rounded-full transition-colors duration-300 ${
              badge === "Must Have for ABM" 
                ? active 
                  ? "bg-white text-[#6218DF] border-2 border-[#6218DF]" 
                  : "bg-white text-[#6218DF] border-2 border-[#6218DF]"
                : active 
                  ? "bg-white text-[#6218DF]" 
                  : "bg-[linear-gradient(180deg,#6218DF_0%,#FEFEFF_277.7%)] text-white"
            }`}
            style={{
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              fontWeight: badge === "Must Have for ABM" ? 700 : 500,
              fontSize: "13px",
              lineHeight: "18px",
              textAlign: "left",
            }}
          >
            {badge}
          </div>
        )}
      </div>

      {/* Title */}
      <h3
        className={`mb-3 sm:mb-4 transition-colors duration-300 ${active ? "text-white" : "text-gray-900"}`}
        style={{
          fontFamily: "Helvetica Neue, Arial, sans-serif",
          fontWeight: 500,
        }}
      >
        <span className="text-[20px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[28px] 2xl:text-[30px] leading-[1.2]">
          {title}
        </span>
      </h3>

      {/* Price */}
      <div className="mb-5 sm:mb-6">
        <span
          className={`text-[30px] sm:text-[34px] md:text-[38px] lg:text-[40px] xl:text-[42px] 2xl:text-[44px] font-bold leading-[1.1] transition-colors duration-300 ${
            active ? "text-white" : "text-gray-900"
          }`}
          style={{ fontFamily: "Helvetica Neue, Arial, sans-serif" }}
        >
          ${price}
        </span>

        <span
          className={`ml-1 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] transition-colors duration-300 ${
            active ? "text-purple-100" : "text-gray-600"
          }`}
          style={{
            fontFamily: "Helvetica Neue, Arial, sans-serif",
            fontWeight: 400,
            lineHeight: "1.3",
          }}
        >
          {period}
        </span>
      </div>

      {/* Subheading */}
      <p
        className={`mb-3 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px] transition-colors duration-300 ${
          active ? "text-white" : "text-gray-700"
        }`}
        style={{
          fontFamily: "Helvetica Neue, Arial, sans-serif",
          fontWeight: 500,
          lineHeight: "1.4",
        }}
      >
        Get started with:
      </p>

      {/* Feature list */}
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check
              className={`w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0 transition-colors duration-300 ${
                active ? "text-white" : "text-[#6218DF]"
              }`}
            />
            <span
              className={`transition-colors duration-300 ${
                active ? "text-white" : "text-gray-800"
              } text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px] xl:text-[18px]`}
              style={{
                fontFamily: "Helvetica Neue, Arial, sans-serif",
                fontWeight: 400,
                lineHeight: "1.5",
              }}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default PricingCard;
