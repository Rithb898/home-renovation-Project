"use client";

import React, { useState, useMemo } from "react";
import {
  FiBell,
  FiSettings,
  FiPlus,
  FiChevronDown,
  FiClock,
  FiClipboard,
  FiMoreVertical,
  FiSearch,
  FiMapPin,
  FiXCircle,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
} from "react-icons/fi";
import { FaPinterest, FaGoogle, FaInstagram, FaFacebook } from "react-icons/fa";
import { BiSolidCalendarCheck } from "react-icons/bi";

// Types
interface Room {
  name: string;
  images: string[];
  dimensions: {
    length: string;
    breadth: string;
    height: string;
  };
}

interface SiteDetails {
  location: string;
  pincode: string;
  projectType: string;
  projectFloor: string;
  currentCondition: string;
  requirements: string;
  duration: string;
}

interface Lead {
  id: string;
  leadId: string;
  name: string;
  budget: string;
  contactNo: string;
  status:
    | "Not Assigned"
    | "Assigned"
    | "Requirement Ghattored"
    | "Estimate Shared"
    | "Visit Planned"
    | "Pending On Client Decision"
    | "On Hold"
    | "Not Interested"
    | "Quotation Approved";
  category: "RESIDENTIAL" | "COMMERCIAL";
  lastUpdate: {
    short: string;
    full: string;
  };
  assignedTo: {
    name: string;
    initial: string;
    color: string;
  };
  follow: boolean;
  source: "Pinterest" | "Google" | "Instagram" | "Facebook";
  siteDetails?: SiteDetails;
  rooms?: Room[];
}

const LeadsManager = () => {
  const [activeTab, setActiveTab] = useState("All Leads");
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpLead, setFollowUpLead] = useState<Lead | null>(null);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");

  // Filter states
  const [searchLeadId, setSearchLeadId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchBudget, setSearchBudget] = useState("");
  const [searchContact, setSearchContact] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // Dummy Data with site details and rooms
  const dummyLeads: Lead[] = [
    {
      id: "1",
      leadId: "L000565",
      name: "RAVI KUMAR",
      budget: "RS 8,00,000/-",
      contactNo: "+91-XXXXXXXXX",
      status: "Pending On Client Decision",
      category: "RESIDENTIAL",
      lastUpdate: {
        short: "Client is deciding how to proceed.",
        full: "Client is deciding how to proceed. Arranging for funds\nDATE: 14/07/2025 - TIME: 04:00",
      },
      assignedTo: {
        name: "Ravi",
        initial: "R",
        color: "bg-yellow-400",
      },
      follow: true,
      source: "Pinterest",
      siteDetails: {
        location: "South Ex Part 2, Delhi",
        pincode: "110066",
        projectType: "1BHK Floor",
        projectFloor: "3rd Floor",
        currentCondition:
          "Needs renovation, Pipes are all damaged, Electrical Failures, Client feels Old",
        requirements: "Old but new, kids room, fancy toilet, modular kitchen",
        duration: "6 months",
      },
      rooms: [
        {
          name: "Bedroom 1",
          images: [
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400",
            "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400",
            "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400",
          ],
          dimensions: {
            length: "18ft",
            breadth: "12ft",
            height: "9ft",
          },
        },
        {
          name: "Bedroom 2",
          images: [
            "https://images.unsplash.com/photo-1616594266889-5b8287f3b5f6?w=400",
            "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=400",
            "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400",
            "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400",
          ],
          dimensions: {
            length: "16ft",
            breadth: "12ft",
            height: "9ft",
          },
        },
        {
          name: "Toilet",
          images: [
            "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400",
            "https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400",
          ],
          dimensions: {
            length: "6ft",
            breadth: "8ft",
            height: "9ft",
          },
        },
      ],
    },
    {
      id: "2",
      leadId: "L000564",
      name: "RISHAB PANT",
      budget: "RS 12,00,000/-",
      contactNo: "+91-9377147883",
      status: "Requirement Ghattored",
      category: "RESIDENTIAL",
      lastUpdate: {
        short: "Had a call regarding requirements",
        full: "Had a call regarding requirements\nDATE: 14/07/2025 - TIME: 04:00",
      },
      assignedTo: {
        name: "Vivek",
        initial: "V",
        color: "bg-purple-500",
      },
      follow: true,
      source: "Google",
    },
    {
      id: "3",
      leadId: "L000563",
      name: "SANIA MIRZ",
      budget: "RS 50,00,000/-",
      contactNo: "+91-9941773773",
      status: "Assigned",
      category: "COMMERCIAL",
      lastUpdate: {
        short: "Client asked to call tomorrow",
        full: "Client asked to call tomorrow\nDATE: 15/07/2025 - TIME: 10:00",
      },
      assignedTo: {
        name: "Tanvi Vivek",
        initial: "TV",
        color: "bg-pink-500",
      },
      follow: true,
      source: "Instagram",
    },
    {
      id: "4",
      leadId: "L000562",
      name: "RAJ KAPOOR",
      budget: "RS 1,50,00,000/-",
      contactNo: "+91-XXXXXXXXX",
      status: "Assigned",
      category: "COMMERCIAL",
      lastUpdate: {
        short: "Client asked to call tomorrow",
        full: "Client asked to call tomorrow\nDATE: 15/07/2025 - TIME: 11:00",
      },
      assignedTo: {
        name: "Babita",
        initial: "B",
        color: "bg-blue-500",
      },
      follow: true,
      source: "Pinterest",
      siteDetails: {
        location: "Connaught Place, Delhi",
        pincode: "110001",
        projectType: "Commercial Office",
        projectFloor: "5th Floor",
        currentCondition: "Good condition, minor repairs needed",
        requirements: "Modern office setup, conference rooms",
        duration: "4 months",
      },
      rooms: [
        {
          name: "Main Office",
          images: [
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
            "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
          ],
          dimensions: {
            length: "30ft",
            breadth: "20ft",
            height: "10ft",
          },
        },
      ],
    },
    {
      id: "5",
      leadId: "L000561",
      name: "RAJESH MITTAL",
      budget: "RS 65,00,000/-",
      contactNo: "+91-7641844578",
      status: "Not Interested",
      category: "RESIDENTIAL",
      lastUpdate: {
        short: "Quotation shared too high",
        full: "Quotation shared too high\nDATE: 14/07/2025 - TIME: 02:00",
      },
      assignedTo: {
        name: "Ravi",
        initial: "R",
        color: "bg-yellow-400",
      },
      follow: false,
      source: "Facebook",
    },
  ];

  // Calculate dynamic tab counts based on actual leads
  const getTabCount = (tabName: string) => {
    switch (tabName) {
      case "All Leads":
        return dummyLeads.length;
      case "Huelip Leads":
        return dummyLeads.filter((lead) => lead.source === "Pinterest").length;
      case "Facebook/ Instagram Leads":
        return dummyLeads.filter(
          (lead) => lead.source === "Facebook" || lead.source === "Instagram"
        ).length;
      case "Google Leads":
        return dummyLeads.filter((lead) => lead.source === "Google").length;
      case "Self Leads":
        return 0; // No self leads in current data
      default:
        return 0;
    }
  };

  const tabs = [
    { name: "All Leads", count: getTabCount("All Leads") },
    { name: "Huelip Leads", count: getTabCount("Huelip Leads") },
    { name: "Facebook/ Instagram Leads", count: getTabCount("Facebook/ Instagram Leads") },
    { name: "Google Leads", count: getTabCount("Google Leads") },
    { name: "Self Leads", count: getTabCount("Self Leads") },
  ];

  // Filtered leads based on search criteria and active tab (source)
  const filteredLeads = useMemo(() => {
    return dummyLeads.filter((lead) => {
      // Tab-based source filtering
      let matchesTab = true;
      switch (activeTab) {
        case "All Leads":
          matchesTab = true;
          break;
        case "Huelip Leads":
          matchesTab = lead.source === "Pinterest"; // Huelip uses Pinterest as source
          break;
        case "Facebook/ Instagram Leads":
          matchesTab = lead.source === "Facebook" || lead.source === "Instagram";
          break;
        case "Google Leads":
          matchesTab = lead.source === "Google";
          break;
        case "Self Leads":
          matchesTab = false; // No self leads in current data
          break;
        default:
          matchesTab = true;
      }

      const matchesLeadId = lead.leadId
        .toLowerCase()
        .includes(searchLeadId.toLowerCase());
      const matchesName = lead.name
        .toLowerCase()
        .includes(searchName.toLowerCase());
      const matchesBudget =
        searchBudget === "" ||
        lead.budget.toLowerCase().includes(searchBudget.toLowerCase());
      const matchesContact = lead.contactNo
        .toLowerCase()
        .includes(searchContact.toLowerCase());
      const matchesStatus = lead.status
        .toLowerCase()
        .includes(searchStatus.toLowerCase());
      const matchesCategory =
        searchCategory === "" || lead.category === searchCategory;

      return (
        matchesTab &&
        matchesLeadId &&
        matchesName &&
        matchesBudget &&
        matchesContact &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    dummyLeads,
    activeTab,
    searchLeadId,
    searchName,
    searchBudget,
    searchContact,
    searchStatus,
    searchCategory,
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Not Assigned":
        return "bg-gray-500 text-white";
      case "Assigned":
        return "bg-green-500 text-white";
      case "Requirement Ghattored":
        return "bg-blue-500 text-white";
      case "Estimate Shared":
        return "bg-purple-500 text-white";
      case "Visit Planned":
        return "bg-indigo-500 text-white";
      case "Pending On Client Decision":
        return "bg-orange-400 text-white";
      case "On Hold":
        return "bg-yellow-500 text-white";
      case "Not Interested":
        return "bg-red-600 text-white";
      case "Quotation Approved":
        return "bg-teal-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "Pinterest":
        return <img src="logo.png" alt="logo"/>;
      case "Google":
        return <img src="google.png" alt="google" />;
      case "Instagram":
        return <img src="instagram.png" alt="instagram" />;
      case "Facebook":
        return <img src="facebook.png" alt="facebook" />;
      default:
        return <FiSearch />;
    }
  };

  const toggleLeadExpansion = (leadId: string) => {
    setExpandedLead(expandedLead === leadId ? null : leadId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Leads Manager</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Calgary Interiors"
                  className="h-8"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-sm font-semibold text-gray-700">
                  Calgary Interiors Pvt. Ltd.
                </span>
              </div>
              <button className="rounded-lg p-2 hover:bg-gray-100">
                <FiBell className="text-xl" />
              </button>
              <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-white">
                  P
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  Pradeep
                </span>
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`relative border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
                  activeTab === tab.name
                    ? "border-red-600 bg-red-50 text-gray-900"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.name}
                <span
                  className={`ml-2 rounded px-2 py-0.5 text-xs font-bold ${
                    activeTab === tab.name
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-3">
          <div className="flex items-center justify-end gap-3">
            <button className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700">
              <FiSettings />
              Leads Config
            </button>
            <button 
              onClick={() => {
                setEditingLead(null);
                setIsEditModalOpen(true);
              }}
              className="flex items-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <FiEdit2 />
              Add Leads
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="px-6 py-4">
        <div className="rounded-lg border border-gray-200 bg-white shadow">
          {/* Table Header */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 px-4 py-3 text-xs font-bold text-gray-700">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4" />
                <span className="ml-2">S.no</span>
              </div>
              <div>
                <div className="mb-1">Lead ID</div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-normal focus:ring-1 focus:ring-red-500 focus:outline-none"
                  value={searchLeadId}
                  onChange={(e) => setSearchLeadId(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Name</div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-normal focus:ring-1 focus:ring-red-500 focus:outline-none"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Budget</div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-normal focus:ring-1 focus:ring-red-500 focus:outline-none"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Contact no.</div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-normal focus:ring-1 focus:ring-red-500 focus:outline-none"
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Status</div>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-normal focus:ring-1 focus:ring-red-500 focus:outline-none"
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Category</div>
                <select
                  className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-normal focus:ring-1 focus:ring-red-500 focus:outline-none"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="RESIDENTIAL">Residential</option>
                  <option value="COMMERCIAL">Commercial</option>
                </select>
              </div>
              <div>Last Update</div>
              <div>Assigned to</div>
              <div>Follow Source</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {filteredLeads.map((lead, index) => (
              <React.Fragment key={lead.id}>
                {/* Main Row */}
                <div
                  className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 px-4 py-3 text-xs font-bold text-gray-700"
                  onClick={() => toggleLeadExpansion(lead.id)}
                >
                  {/* S.no */}
                  <div className="flex items-center text-sm font-semibold text-gray-900">
                    <input
                      type="checkbox"
                      className="mr-2 h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {index + 1}
                  </div>

                  {/* Lead ID */}
                  <div className="text-sm font-bold text-gray-900">
                    {lead.leadId}
                  </div>

                  {/* Name */}
                  <div className="text-sm font-bold text-gray-900">
                    {lead.name}
                  </div>

                  {/* Budget */}
                  <div className="text-sm font-semibold text-gray-700">
                    {lead.budget}
                  </div>

                  {/* Contact */}
                  <div className="text-sm text-gray-600">{lead.contactNo}</div>

                  {/* Status */}
                  <div>
                    <span
                      className={`block min-w-[10px] rounded-full px-3 py-1 text-center text-xs font-semibold ${getStatusStyle(lead.status)}`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  {/* Category */}
                  <div>
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs font-bold ${
                        lead.category === "RESIDENTIAL"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`} 
                    >
                      {lead.category}
                    </span>
                  </div>

                  {/* Last Update */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedUpdate(
                          expandedUpdate === lead.id ? null : lead.id,
                        );
                      }}
                      className="text-left text-xs text-gray-600 transition-colors hover:text-gray-900"
                    >
                      {expandedUpdate === lead.id
                        ? lead.lastUpdate.full
                        : lead.lastUpdate.short}
                    </button>
                  </div>

                  {/* Assigned To */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-8 w-8 ${lead.assignedTo.color} flex items-center justify-center rounded-full text-xs font-bold text-white`}
                    >
                      {lead.assignedTo.initial}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">
                      {lead.assignedTo.name}
                    </span>
                  </div>

                  {/* Follow & Source */}
                  <div className="flex items-center gap-2">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 transition-colors hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFollowUpLead(lead);
                        setIsFollowUpModalOpen(true);
                      }}
                    >
                      <BiSolidCalendarCheck className="text-2xl" />
                    </button>
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded text-sm font-bold ${
                        lead.source === "Pinterest"
                          ? "text-white"
                          : lead.source === "Google"
                            ? "text-blue-500"
                            : lead.source === "Instagram"
                              ? "text-pink-500"
                              : "text-blue-600"
                      }`}
                    >
                      {getSourceIcon(lead.source)}
                    </div>
                    <div className="relative">
                      <button
                        className="text-gray-400 transition-colors hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenDropdownId(openDropdownId === lead.id ? null : lead.id);
                        }}
                      >
                        <FiMoreVertical className="text-lg text-gray-700 cursor-pointer" />
                      </button>
                      {openDropdownId === lead.id && (
                        <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingLead(lead);
                              setIsEditModalOpen(true);
                              setOpenDropdownId(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <FiEdit2 className="text-blue-500" />
                            Edit Lead
                          </button>
                          <button
                            onClick={() => toggleLeadExpansion(lead.id)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <FiEye className="text-green-500" />
                            View Details
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(null);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-gray-50"
                          >
                            <FiTrash2 />
                            Delete Lead
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedLead === lead.id && lead.siteDetails && (
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Site Details */}
                      <div className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="mb-4 flex items-center gap-2">
                          <span className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-1 text-sm font-bold text-white">
                            <FiMapPin />
                            Site Details
                          </span>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">
                              Location
                            </span>
                            <span className="text-gray-900">
                              : {lead.siteDetails.location}
                            </span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">
                              Pincode
                            </span>
                            <span className="text-gray-900">
                              : {lead.siteDetails.pincode}
                            </span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">
                              Project Type
                            </span>
                            <span className="text-gray-900">
                              : {lead.siteDetails.projectType}
                            </span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">
                              Project Floor
                            </span>
                            <span className="text-gray-900">
                              : {lead.siteDetails.projectFloor}
                            </span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">
                              Current Condition
                            </span>
                            <span className="text-gray-900">
                              : {lead.siteDetails.currentCondition}
                            </span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">
                              Requirements
                            </span>
                            <span className="text-gray-900">
                              : {lead.siteDetails.requirements}
                            </span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">
                              Duration of Project
                            </span>
                            <span className="text-gray-900">
                              : {lead.siteDetails.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="space-y-4">
                        {lead.rooms?.map((room, roomIndex) => (
                          <div
                            key={roomIndex}
                            className="rounded-lg border border-gray-200 bg-white p-4"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <span className="rounded-full bg-red-600 px-4 py-1 text-sm font-bold text-white">
                                {room.name}
                              </span>
                              <div className="flex gap-4 text-xs font-semibold text-gray-700">
                                <span>Length: {room.dimensions.length}</span>
                                <span>Breadth: {room.dimensions.breadth}</span>
                                <span>Height: {room.dimensions.height}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {room.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="group relative">
                                  <img
                                    src={image}
                                    alt={`${room.name} ${imgIndex + 1}`}
                                    className="h-24 w-full cursor-pointer rounded border border-gray-200 object-cover transition-opacity hover:opacity-80"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedImage(image);
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* No Results Message */}
          {filteredLeads.length === 0 && (
            <div className="py-8 text-center text-gray-500">
              No leads found matching your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-4xl">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-10 right-0 text-3xl text-white hover:text-gray-300"
            >
              <FiXCircle />
            </button>
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-h-[90vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingLead ? `Edit Lead - ${editingLead.leadId}` : 'Edit Lead'}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form className="space-y-6">
                {/* Basic Information */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Lead ID
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.leadId || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="L000000"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.name || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Budget
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.budget || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="RS 0,00,000/-"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Contact Number
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.contactNo || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="+91-XXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Status
                      </label>
                      <select
                        defaultValue={editingLead?.status || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="Not Assigned">Not Assigned</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Requirement Ghattored">Requirement Ghattored</option>
                        <option value="Estimate Shared">Estimate Shared</option>
                        <option value="Visit Planned">Visit Planned</option>
                        <option value="Pending On Client Decision">Pending On Client Decision</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Not Interested">Not Interested</option>
                        <option value="Quotation Approved">Quotation Approved</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Category
                      </label>
                      <select
                        defaultValue={editingLead?.category || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="RESIDENTIAL">RESIDENTIAL</option>
                        <option value="COMMERCIAL">COMMERCIAL</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Source
                      </label>
                      <select
                        defaultValue={editingLead?.source || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      >
                        <option value="Pinterest">Pinterest (Huelip)</option>
                        <option value="Google">Google</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Facebook">Facebook</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Assigned To
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.assignedTo.name || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Enter assignee name"
                      />
                    </div>
                  </div>
                </div>

                {/* Site Details */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Site Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Location
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.siteDetails?.location || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Enter location"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Pincode
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.siteDetails?.pincode || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Enter pincode"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Project Type
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.siteDetails?.projectType || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="e.g., 1BHK Floor"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Project Floor
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.siteDetails?.projectFloor || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="e.g., 3rd Floor"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Current Condition
                      </label>
                      <textarea
                        defaultValue={editingLead?.siteDetails?.currentCondition || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Describe current condition"
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Requirements
                      </label>
                      <textarea
                        defaultValue={editingLead?.siteDetails?.requirements || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="Enter requirements"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-gray-700">
                        Duration of Project
                      </label>
                      <input
                        type="text"
                        defaultValue={editingLead?.siteDetails?.duration || ''}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                        placeholder="e.g., 6 months"
                      />
                    </div>
                  </div>
                </div>

                {/* Last Update */}
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-4 text-lg font-bold text-gray-900">Last Update</h3>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                      Update Details
                    </label>
                    <textarea
                      defaultValue={editingLead?.lastUpdate.full || ''}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      placeholder="Enter update details with date and time"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      // Handle save logic here
                      setIsEditModalOpen(false);
                    }}
                    className="rounded-lg bg-red-600 px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Follow-Up Reminder Modal */}
      {isFollowUpModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setIsFollowUpModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border-2 border-gray-300 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <BiSolidCalendarCheck className="text-2xl text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Add Follow Up Reminder
                </h2>
              </div>
              <button
                onClick={() => setIsFollowUpModalOpen(false)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <FiX className="text-2xl" />
              </button>
            </div>

            {/* Date and Time Inputs */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
                  placeholder="__ / __ / ____"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-gray-900">
                  Time
                </label>
                <input
                  type="time"
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 text-sm focus:border-red-500 focus:outline-none"
                  placeholder="__ / __ / ____"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => {
                  // Handle save logic here
                  console.log("Follow-up saved:", {
                    lead: followUpLead?.leadId,
                    date: followUpDate,
                    time: followUpTime,
                  });
                  setFollowUpDate("");
                  setFollowUpTime("");
                  setIsFollowUpModalOpen(false);
                }}
                className="rounded-full bg-red-600 px-8 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
              >
                Save
              </button>
            </div>

            {/* Follow Up History */}
            <div>
              <h3 className="mb-3 text-center text-lg font-bold text-gray-900">
                Follow Up History
              </h3>
              <div className="overflow-hidden rounded-lg border border-gray-300">
                {/* Table Header */}
                <div className="grid grid-cols-2 border-b border-gray-300 bg-gray-100">
                  <div className="border-r border-gray-300 px-4 py-2 text-center text-sm font-bold text-gray-900">
                    Date
                  </div>
                  <div className="px-4 py-2 text-center text-sm font-bold text-gray-900">
                    Time
                  </div>
                </div>
                {/* Table Body - Empty rows for now */}
                <div className="divide-y divide-gray-200 bg-white">
                  <div className="grid grid-cols-2">
                    <div className="border-r border-gray-300 px-4 py-3 text-center text-sm text-gray-500">
                      -
                    </div>
                    <div className="px-4 py-3 text-center text-sm text-gray-500">
                      -
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="border-r border-gray-300 px-4 py-3 text-center text-sm text-gray-500">
                      -
                    </div>
                    <div className="px-4 py-3 text-center text-sm text-gray-500">
                      -
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="border-r border-gray-300 px-4 py-3 text-center text-sm text-gray-500">
                      -
                    </div>
                    <div className="px-4 py-3 text-center text-sm text-gray-500">
                      -
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManager;
