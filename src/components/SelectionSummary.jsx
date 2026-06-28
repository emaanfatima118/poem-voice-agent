import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

function SelectionSummary({ selections }) {
  const total = selections.reduce((sum, item) => sum + item.price, 0);
  const showDiscount = selections.length >= 2;
  const discountedTotal = showDiscount ? (total * 0.95).toFixed(2) : total.toFixed(2);

  return (
    <Card
      className="p-6 sm:p-8 md:p-10 border-2 rounded-2xl bg-white shadow-sm"
      style={{
        borderColor: "#6218DF", // Purple border
      }}
    >
      {/* Title */}
      <h3
        className="text-center mb-6 text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px] leading-[1.2]"
        style={{
          fontFamily: "Helvetica Neue, Arial, sans-serif",
          fontWeight: 700,
          fontStyle: "Bold",
          lineHeight: "36.31px",
          letterSpacing: "-0.5px",
        }}
      >
        Your Selections
      </h3>

      {selections.length > 0 ? (
        <>
          {/* Selected Items */}
          <div className="space-y-3 mb-6">
            {selections.map((selection, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px]"
              >
                <span
                  className="text-gray-700"
                  style={{
                    fontFamily: "Helvetica Neue, Arial, sans-serif",
                    fontWeight: 500,
                    lineHeight: "31.77px",
                  }}
                >
                  {selection.name}
                </span>
                <span
                  className="text-gray-900"
                  style={{
                    fontFamily: "Helvetica Neue, Arial, sans-serif",
                    fontWeight: 500,
                    lineHeight: "31.77px",
                  }}
                >
                  ${selection.price}
                </span>
              </div>
            ))}
          </div>

          {/* Discount line (only if 2+ selected) */}
          {showDiscount && (
            <p
              className="text-center text-gray-500 mb-4 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]"
              style={{
                fontFamily: "Aeonik, Arial, sans-serif",
                fontWeight: 400,
                fontStyle: "Regular",
                textAlign: "center",
              }}
            >
              5% Bundle Discount Applied
            </p>
          )}

          {/* Total */}
          <div className="border-t border-gray-200 pt-4 mb-2">
            <p
              className="text-center text-[22px] sm:text-[26px] md:text-[30px] lg:text-[32px]"
              style={{
                fontFamily: "Helvetica Neue, Arial, sans-serif",
                fontWeight: 700,
                fontStyle: "Bold",
                color: "#3A3A3A",
              }}
            >
              Total:{" "}
              <span className="text-[#3A3A3A]">
                ${discountedTotal}
              </span>
              <span className="text-[#3A3A3A] text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px]">
                {" "}
                /month
              </span>
            </p>
          </div>

          {/* CTA Button */}
          <Button
            className="w-full text-white rounded-full py-4 sm:py-5 md:py-6 transition-all duration-300 hover:scale-[1.03]"
            style={{
              backgroundColor: "#6218DF",
              fontFamily: "Aeonik, Arial, sans-serif",
              fontWeight: 500,
              fontSize: "16px",
              lineHeight: "28.16px",
            }}
          >
            <span className="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[18.78px]">
              Add to Cart & Create Account
            </span>
          </Button>
        </>
      ) : (
        // Empty State
        <div className="text-center py-8">
          <p
            className="text-gray-400"
            style={{
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              fontWeight: 400,
              fontSize: "16px",
            }}
          >
            No plans selected yet
          </p>
          <p
            className="text-gray-400 text-sm mt-2"
            style={{
              fontFamily: "Helvetica Neue, Arial, sans-serif",
              fontWeight: 400,
              fontSize: "14px",
            }}
          >
            Click on a plan to add it to your cart
          </p>
        </div>
      )}
    </Card>
  );
}

export default SelectionSummary;
