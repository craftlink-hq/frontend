"use client";
import React, { useState, useRef, useEffect } from "react";
import { FilterProps, filters } from "@/utils/filters";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import useIsArtisan from '@/hooks/Registry/useIsArtisan';
import useIsClient from '@/hooks/Registry/useIsClient';
import CraftcoinCard from './CraftcoinCard';

const Filter = ({ filters: propFilters }: { filters?: FilterProps[] }) => {
  const filtersToUse = propFilters || filters;
  const isArtisan = useIsArtisan();
  const isClient = useIsClient();
  
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({
    "Budget": true,
    "Location": false, 
    "Job duration": false,
    "Job Category": true,
  });

  const initialCheckedState: { [key: string]: boolean } = {};
  filtersToUse.forEach(({ options }) => {
    options.forEach((option) => {
      initialCheckedState[option] = false;
    });
  });
  
  // Set initial selections to match screenshot
  initialCheckedState["Under $50"] = true;
  initialCheckedState["Fashion Designer"] = true;

  const [checked, setChecked] = useState<{ [key: string]: boolean }>(
    initialCheckedState
  );

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    "Location": false,
    "Job duration": false,
  });
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [selectedBudget, setSelectedBudget] = useState("Under $50");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobDuration, setSelectedJobDuration] = useState("");
  const [customBudget, setCustomBudget] = useState('30000');
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key]?.contains(event.target as Node)) {
          setOpenDropdowns(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (filterName: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const selectOption = (filterName: string, option: string) => {
    if (filterName === "Location") {
      setSelectedLocation(option);
    } else if (filterName === "Job duration") {
      setSelectedJobDuration(option);
    }
    setOpenDropdowns(prev => ({ ...prev, [filterName]: false }));
  };

  const toggleFilter = (filterName: string) => {
    setOpenFilters((prevState) => ({
      ...prevState,
      [filterName]: !prevState[filterName],
    }));
  };

  const handleCheck = (option: string) => {
    setChecked((prevState) => {
      return { ...prevState, [option]: !prevState[option] };
    });
  };

  const handleBudgetRadio = (option: string) => {
    // Clear all budget options first
    const updatedChecked = { ...checked };
    ["Under $50", "$50 - $200", "$200 above", "Custom"].forEach(budgetOption => {
      updatedChecked[budgetOption] = false;
    });
    // Set the selected option
    updatedChecked[option] = true;
    setChecked(updatedChecked);
    setSelectedBudget(option);
  };

  const handleReset = () => {
    const resetState = { ...initialCheckedState };
    resetState["Under $50"] = true;
    resetState["Fashion Designer"] = true;
    setChecked(resetState);
    setCustomBudget('30000');
    setJobTitle('');
    setSelectedBudget("Under $50");
    setSelectedLocation("");
    setSelectedJobDuration("");
    setOpenDropdowns({ "Location": false, "Job duration": false });
  };

  const filterHeight = isClient 
    ? 'calc(100vh - 216px)'
    : '100vh';

  return (
    <div className="max-sm:py-4">
      <style jsx>{`
        .filter-container {
          background-color: #F2E8CF0A;
          border-width: 0px 1px 1px 1px;
          border-style: solid;
          border-color: #FCFBF726;
        }

        .input-field {
          background-color: #F2E8CF29;
        }

        .checkbox-container {
          background-color: #0C0C0D0D;
        }
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6b7280 transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 10px;
          height: 40px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .category-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6b7280 transparent;
        }
        
        .category-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .category-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .category-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 10px;
          height: 30px;
        }
        
        .category-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        .cards-container {
          width: 400px; /* Same width as CraftcoinCard */
          display: flex;
          flex-direction: column;
          gap: 16px; /* Consistent spacing between cards */
          height: 100vh; /* Fixed total height */
        }

        .filter-card {
          width: 400px !important; /* Force exact same width as CraftcoinCard */
          max-width: 400px !important; /* Override any max-width constraints */
        }

        .location-job-select {
          background-color: #333333 !important;
        }

        .location-job-select option {
          background-color: #333333 !important;
          color: #d1d5db;
        }

        .location-job-select option:hover,
        .location-job-select option:focus {
          background-color: #F9F1E21C !important;
          color: white;
        }

        .location-job-select:focus option:hover {
          background-color: #F9F1E21C !important;
        }

        .custom-dropdown {
          position: relative;
        }

        .dropdown-button {
          background-color: #333333;
          border: 1px solid #4a5568;
          border-radius: 0.375rem;
          padding: 0.5rem 0.75rem;
          width: 100%;
          text-align: left;
          color: #d1d5db;
          cursor: pointer;
          display: flex;
          justify-content: between;
          align-items: center;
        }

        .dropdown-button:focus {
          outline: none;
          border-color: #6b7280;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 50;
          background-color: #333333;
          border: 1px solid #4a5568;
          border-radius: 0.375rem;
          margin-top: 0.25rem;
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }

        .dropdown-option {
          padding: 0.5rem 0.75rem;
          color: #d1d5db;
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
        }

        .dropdown-option:hover {
          background-color: #F9F1E21C !important;
          color: white;
        }
      `}</style>
      
      {/* Cards Container with Consistent Width and Spacing */}
      <div className="cards-container">
        {/* Conditional CraftcoinBalanceCard for Clients */}
        { isClient && <CraftcoinCard />}
        
        {/* Filter Card with Dynamic Height */}
        <div 
          className="filter-container filter-card rounded-md shadow-md px-2 overflow-y-scroll custom-scrollbar"
          style={{ height: filterHeight, width: '400px', maxWidth: '400px' }}
        >
          {/* Header */}
          <div className="flex justify-between px-2 py-4">
            <span className="font-bold text-white text-xl">
              Filter
            </span>
            <button 
              onClick={handleReset}
              className="gap-x-2 flex self-center hover:opacity-80 transition-opacity"
            >
              <span className="font-bold text-white text-sm">
                RESET
              </span>
              <div className="w-5 h-5 rounded-full flex items-center justify-center self-center" style={{ backgroundColor: '#FAB427' }}>
                <IoClose size={12} className="text-black" />
              </div>
            </button>
          </div>
          
          {/* Filter Sections */}
          <div className="w-full flex flex-col gap-y-4 p-4">
            {filtersToUse.map(({ filter, options }, index) => (
              <div className={index < filtersToUse.length - 1 ? "py-2 border-b border-gray-700" : "py-2"} key={filter}>
                {/* Filter Header */}
                <button
                  className="flex w-full justify-between"
                  onClick={() => toggleFilter(filter)}
                >
                  <span className="font-bold text-white">
                    {filter}
                  </span>
                  {openFilters[filter] ? (
                    <RiArrowDropUpLine size={24} className="text-white" />
                  ) : (
                    <RiArrowDropDownLine size={24} className="text-white" />
                  )}
                </button>
                
                {/* Filter Content */}
                {openFilters[filter] && (
                  <div className="px-2 mt-2">
                    {/* Budget - Radio buttons */}
                    {filter === "Budget" && (
                      <div className="space-y-3 checkbox-container p-4 rounded-md border border-[#FCFBF726]">
                        {options.map((option) => (
                          <label key={option} className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="radio"
                                name="budget"
                                value={option}
                                checked={checked[option]}
                                onChange={() => handleBudgetRadio(option)}
                                className="sr-only"
                              />
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                                checked[option] 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'border-gray-500 group-hover:border-gray-400'
                              }`}>
                                {checked[option] && (
                                  <FaCheck size={8} color="white" />
                                )}
                              </div>
                            </div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                              {option}
                            </span>
                          </label>
                        ))}
                        
                        {/* Custom Budget Input - Always visible to match screenshot */}
                        <div className="mt-4">
                          <p className="text-sm text-gray-400 mb-2">Please specify your budget</p>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                            <input
                              type="text"
                              value={customBudget}
                              onChange={(e) => setCustomBudget(e.target.value)}
                              className="input-field w-full border border-gray-600 rounded px-8 py-2 text-white focus:outline-none focus:border-gray-500"
                              placeholder="30000"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Location and Job duration - Custom Dropdown */}
                    {(filter === "Location" || filter === "Job duration") && (
                      <div className="relative checkbox-container p-2 rounded-md border border-[#FCFBF726]">
                        <div 
                          className="custom-dropdown"
                          ref={el => dropdownRefs.current[filter] = el}
                        >
                          <button
                            type="button"
                            className="dropdown-button"
                            onClick={() => toggleDropdown(filter)}
                          >
                            <span>
                              {filter === "Location" 
                                ? (selectedLocation || "Select preferred Location...")
                                : (selectedJobDuration || "Select category")
                              }
                            </span>
                            <RiArrowDropDownLine 
                              className={`text-gray-400 transition-transform ${openDropdowns[filter] ? 'rotate-180' : ''}`} 
                              size={16} 
                            />
                          </button>
                          
                          {openDropdowns[filter] && (
                            <div className="dropdown-menu">
                              {options.map((option) => (
                                <div
                                  key={option}
                                  className="dropdown-option"
                                  onClick={() => selectOption(filter, option)}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Job Category - Dropdown + Checkboxes */}
                    {filter === "Job Category" && (
                      <div className="space-y-4 checkbox-container p-4 rounded-md border border-[#FCFBF726]">
                        <div className="input-field flex justify-between text-gray-300 py-2 px-4 rounded-md border border-gray-600">
                          <span>Select category</span>
                          <RiArrowDropDownLine size={24} className="text-gray-400" />
                        </div>
                        
                        {/* Category Checkboxes with Custom Scrollbar */}
                        <div 
                          className="checkbox-container w-full p-4 border rounded-md shadow-md border-t-0 border-[#FCFBF726] space-y-2 category-scrollbar"
                          style={{
                            maxHeight: '200px',
                            overflowY: 'scroll'
                          }}
                        >
                          {options.map((option) => (
                            <div key={option} className="flex gap-4 capitalize">
                              <div className="relative h-[20px] w-[20px]">
                                <input
                                  type="checkbox"
                                  onChange={() => handleCheck(option)}
                                  checked={checked[option]}
                                  className="appearance-none h-[20px] w-[20px] border-2 rounded-sm p-2 checked:border-0 checked:bg-green-500 border-gray-500"
                                />
                                {checked[option] && (
                                  <FaCheck
                                    size={12}
                                    color={"white"}
                                    className="absolute top-[4px] left-[4px] pointer-events-none"
                                  />
                                )}
                              </div>
                              <span className="text-gray-300">{option}</span>
                            </div>
                          ))}
                        </div>

                        {/* Job Title Input - Partial text visible as in screenshot */}
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Please specify job title</p>
                          <input
                            type="text"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder=""
                            className="input-field w-full border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-gray-500"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;