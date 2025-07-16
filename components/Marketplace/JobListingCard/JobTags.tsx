"use client";
import React from "react";
import { JobTagsProps } from "@/utils/types";

const JobTags: React.FC<JobTagsProps> = ({ 
  job, 
  jobId, 
  isExpanded, 
  onToggle 
}) => {
  const getVisibleTags = (tags: string[], maxVisible: number = 5, isMobile: boolean = false) => {
    if (!tags) return { visible: [], remaining: 0 };
    const mobileMaxVisible = isMobile ? 2 : maxVisible;
    const visible = tags.slice(0, isExpanded ? tags.length : mobileMaxVisible);
    const remaining = Math.max(0, tags.length - mobileMaxVisible);
    return { visible, remaining };
  };

  const tags = job.skillCategory || [];
  
  // For desktop (default behavior)
  const { visible: desktopVisible, remaining: desktopRemaining } = getVisibleTags(
    tags, 
    isExpanded ? tags.length : 5,
    false
  );
  
  // For mobile
  const { visible: mobileVisible, remaining: mobileRemaining } = getVisibleTags(
    tags, 
    isExpanded ? tags.length : 2,
    true
  );

  return (
    <>
      <style jsx>{`
        .job-tags {
          font-family: Merriweather;
          font-weight: 400;
          font-size: 13px;
          line-height: 120%;
          letter-spacing: 0%;
          color: #D8D6CF;
        }

        .tag-pill {
          height: 40px;
          padding: 12px 16px;
          gap: 10px;
          border-radius: 50px;
          border: 1px solid #FFFFFF40;
          background-color: #26220826;
          width: fit-content;
        }
        
        .desktop-tags {
          display: flex;
        }
        
        .mobile-tags {
          display: none;
        }
        
        .mobile-count-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #FFFFFF20;
          border: 1px solid #FFFFFF40;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 500;
          color: #D8D6CF;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .mobile-count-circle:hover {
          background-color: #FFFFFF30;
        }

        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .desktop-tags {
            display: none;
          }
          
          .mobile-tags {
            display: flex;
          }
          
          .job-tags {
            font-size: 11px;
          }
          
          .tag-pill {
            height: 32px;
            padding: 8px 12px;
            font-size: 11px;
          }
        }
      `}</style>
      
      {/* Tags */}
      <div className="mb-4">
        {/* Desktop View */}
        <div className="desktop-tags flex-wrap gap-1">
          {desktopVisible.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="job-tags tag-pill flex items-center justify-center"
            >
              {tag}
            </span>
          ))}
          {desktopRemaining > 0 && !isExpanded && (
            <span
              className="job-tags tag-pill flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onToggle(jobId)}
            >
              +{desktopRemaining}
            </span>
          )}
          {isExpanded && tags.length > 5 && (
            <span
              className="job-tags tag-pill flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onToggle(jobId)}
            >
              Show Less
            </span>
          )}
        </div>
        
        {/* Mobile View */}
        <div className="mobile-tags flex-wrap gap-1 items-center">
          {mobileVisible.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="job-tags tag-pill flex items-center justify-center"
            >
              {tag}
            </span>
          ))}
          {mobileRemaining > 0 && !isExpanded && (
            <div
              className="mobile-count-circle"
              onClick={() => onToggle(jobId)}
            >
              +{mobileRemaining}
            </div>
          )}
          {isExpanded && tags.length > 2 && (
            <div
              className="mobile-count-circle"
              onClick={() => onToggle(jobId)}
            >
              −
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default JobTags;