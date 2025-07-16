"use client";
import React from "react";
import { JobPricingProps } from "@/utils/types";
import Image from "next/image";

const JobPricing: React.FC<JobPricingProps> = ({ job }) => {
  const formatPrice = (price: number) => {
    const nairaEquivalent = price * 1500; // Rough conversion rate
    return {
      usd: price,
      naira: nairaEquivalent.toLocaleString()
    };
  };

  return (
    <>
      <style jsx>{`
        .job-price {
          font-family: Alata;
          font-weight: 400;
          font-size: 32px;
          line-height: 120%;
          letter-spacing: 0%;
          color: #FFCC6D;
        }

        .job-payment-type {
          font-family: Alata;
          font-weight: 400;
          color: #FFCC6D;
          align-self: flex-end;
        }
        
        .money-icon {
          width: 16px;
          height: 16px;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .money-icon {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
      
      {/* Price Section */}
      <div className="mb-4">
        <div className="flex items-end gap-2 mb-1">
          <div className="flex items-center gap-2">
            <Image 
              src="/market/money-2.svg" 
              alt="Price" 
              width={16} 
              height={16} 
              className="money-icon"
              style={{ filter: 'brightness(0) saturate(100%) invert(74%) sepia(85%) saturate(353%) hue-rotate(358deg) brightness(101%) contrast(97%)' }} 
            />
            <span className="job-price">
              ${job.price?.toLocaleString()}
            </span>
          </div>
          <span className="job-payment-type text-sm">({job.paymentType})</span>
        </div>
        <div className="text-gray-400 text-xs">
          ≈ ₦{formatPrice(job.price || 0).naira}
        </div>
      </div>
    </>
  );
};

export default JobPricing;