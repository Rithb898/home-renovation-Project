"use client";

import React, { useState, useMemo } from 'react';
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
  FiXCircle 
} from 'react-icons/fi';
import { FaPinterest, FaGoogle, FaInstagram, FaFacebook } from 'react-icons/fa';

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
  status: 'Pending on Client Decision' | 'Requirement Ghattored' | 'Assigned' | 'Not Interested';
  category: 'RESIDENTIAL' | 'COMMERCIAL';
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
  source: 'Pinterest' | 'Google' | 'Instagram' | 'Facebook';
  siteDetails?: SiteDetails;
  rooms?: Room[];
}

const LeadsManager = () => {
  const [activeTab, setActiveTab] = useState('All Leads');
  const [expandedUpdate, setExpandedUpdate] = useState<string | null>(null);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  
  // Filter states
  const [searchLeadId, setSearchLeadId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchContact, setSearchContact] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  // Dummy Data with site details and rooms
  const dummyLeads: Lead[] = [
    {
      id: '1',
      leadId: 'L000565',
      name: 'RAVI KUMAR',
      budget: 'RS 8,00,000/-',
      contactNo: '+91-XXXXXXXXX',
      status: 'Pending on Client Decision',
      category: 'RESIDENTIAL',
      lastUpdate: {
        short: 'Client is deciding how to proceed.',
        full: 'Client is deciding how to proceed. Arranging for funds\nDATE: 14/07/2025 - TIME: 04:00'
      },
      assignedTo: {
        name: 'Ravi',
        initial: 'R',
        color: 'bg-yellow-400'
      },
      follow: true,
      source: 'Pinterest',
      siteDetails: {
        location: 'South Ex Part 2, Delhi',
        pincode: '110066',
        projectType: '1BHK Floor',
        projectFloor: '3rd Floor',
        currentCondition: 'Needs renovation, Pipes are all damaged, Electrical Failures, Client feels Old',
        requirements: 'Old but new, kids room, fancy toilet, modular kitchen',
        duration: '6 months'
      },
      rooms: [
        {
          name: 'Bedroom 1',
          images: [
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400',
            'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400',
            'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400'
          ],
          dimensions: {
            length: '18ft',
            breadth: '12ft',
            height: '9ft'
          }
        },
        {
          name: 'Bedroom 2',
          images: [
            'https://images.unsplash.com/photo-1616594266889-5b8287f3b5f6?w=400',
            'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=400',
            'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400',
            'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400'
          ],
          dimensions: {
            length: '16ft',
            breadth: '12ft',
            height: '9ft'
          }
        },
        {
          name: 'Toilet',
          images: [
            'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400',
            'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400'
          ],
          dimensions: {
            length: '6ft',
            breadth: '8ft',
            height: '9ft'
          }
        }
      ]
    },
    {
      id: '2',
      leadId: 'L000564',
      name: 'RISHAB PANT',
      budget: 'RS 12,00,000/-',
      contactNo: '+91-9377147883',
      status: 'Requirement Ghattored',
      category: 'RESIDENTIAL',
      lastUpdate: {
        short: 'Had a call regarding requirements',
        full: 'Had a call regarding requirements\nDATE: 14/07/2025 - TIME: 04:00'
      },
      assignedTo: {
        name: 'Vivek',
        initial: 'V',
        color: 'bg-purple-500'
      },
      follow: true,
      source: 'Google'
    },
    {
      id: '3',
      leadId: 'L000563',
      name: 'SANIA MIRZ',
      budget: 'RS 50,00,000/-',
      contactNo: '+91-9941773773',
      status: 'Assigned',
      category: 'COMMERCIAL',
      lastUpdate: {
        short: 'Client asked to call tomorrow',
        full: 'Client asked to call tomorrow\nDATE: 15/07/2025 - TIME: 10:00'
      },
      assignedTo: {
        name: 'Tanvi Vivek',
        initial: 'TV',
        color: 'bg-pink-500'
      },
      follow: true,
      source: 'Instagram'
    },
    {
      id: '4',
      leadId: 'L000562',
      name: 'RAJ KAPOOR',
      budget: 'RS 1,50,00,000/-',
      contactNo: '+91-XXXXXXXXX',
      status: 'Assigned',
      category: 'COMMERCIAL',
      lastUpdate: {
        short: 'Client asked to call tomorrow',
        full: 'Client asked to call tomorrow\nDATE: 15/07/2025 - TIME: 11:00'
      },
      assignedTo: {
        name: 'Babita',
        initial: 'B',
        color: 'bg-blue-500'
      },
      follow: true,
      source: 'Pinterest',
      siteDetails: {
        location: 'Connaught Place, Delhi',
        pincode: '110001',
        projectType: 'Commercial Office',
        projectFloor: '5th Floor',
        currentCondition: 'Good condition, minor repairs needed',
        requirements: 'Modern office setup, conference rooms',
        duration: '4 months'
      },
      rooms: [
        {
          name: 'Main Office',
          images: [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
            'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400'
          ],
          dimensions: {
            length: '30ft',
            breadth: '20ft',
            height: '10ft'
          }
        }
      ]
    },
    {
      id: '5',
      leadId: 'L000561',
      name: 'RAJESH MITTAL',
      budget: 'RS 65,00,000/-',
      contactNo: '+91-7641844578',
      status: 'Not Interested',
      category: 'RESIDENTIAL',
      lastUpdate: {
        short: 'Quotation shared too high',
        full: 'Quotation shared too high\nDATE: 14/07/2025 - TIME: 02:00'
      },
      assignedTo: {
        name: 'Ravi',
        initial: 'R',
        color: 'bg-yellow-400'
      },
      follow: false,
      source: 'Facebook'
    }
  ];

  const tabs = [
    { name: 'All Leads', count: 5 },
    { name: 'Huelip Leads', count: 2 },
    { name: 'Facebook/ Instagram Leads', count: 1 },
    { name: 'Google Leads', count: 1 },
    { name: 'Self Leads', count: 1 }
  ];

  // Filtered leads based on search criteria
  const filteredLeads = useMemo(() => {
    return dummyLeads.filter(lead => {
      const matchesLeadId = lead.leadId.toLowerCase().includes(searchLeadId.toLowerCase());
      const matchesName = lead.name.toLowerCase().includes(searchName.toLowerCase());
      const matchesBudget = searchBudget === '' || lead.budget.toLowerCase().includes(searchBudget.toLowerCase());
      const matchesContact = lead.contactNo.toLowerCase().includes(searchContact.toLowerCase());
      const matchesStatus = lead.status.toLowerCase().includes(searchStatus.toLowerCase());
      const matchesCategory = searchCategory === '' || lead.category === searchCategory;

      return matchesLeadId && matchesName && matchesBudget && matchesContact && matchesStatus && matchesCategory;
    });
  }, [dummyLeads, searchLeadId, searchName, searchBudget, searchContact, searchStatus, searchCategory]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pending on Client Decision':
        return 'bg-orange-400 text-white';
      case 'Requirement Ghattored':
        return 'bg-blue-500 text-white';
      case 'Assigned':
        return 'bg-green-500 text-white';
      case 'Not Interested':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Pinterest':
        return <FaPinterest />;
      case 'Google':
        return <FaGoogle />;
      case 'Instagram':
        return <FaInstagram />;
      case 'Facebook':
        return <FaFacebook />;
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Leads Manager</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Calgary Interiors" className="h-8" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }} />
                <span className="text-sm font-semibold text-gray-700">Calgary Interiors Pvt. Ltd.</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FiBell className="text-xl" />
              </button>
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-200">
                <span className="w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white">P</span>
                <span className="text-sm font-semibold text-gray-700">Pradeep</span>
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-5 py-3 text-sm font-semibold transition-all relative border-b-2 ${
                  activeTab === tab.name
                    ? 'text-gray-900 border-red-600 bg-red-50'
                    : 'text-gray-600 border-transparent hover:bg-gray-50'
                }`}
              >
                {tab.name}
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                  activeTab === tab.name ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-3">
          <div className="flex items-center justify-end gap-3">
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded flex items-center gap-2 transition-colors">
              <FiSettings />
              Leads Config
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded flex items-center gap-2 transition-colors">
              <FiPlus />
              Add Leads
            </button>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2 px-4 py-3 text-xs font-bold text-gray-700">
              <div className="flex items-center">
                <input type="checkbox" className="w-4 h-4" />
                <span className="ml-2">S.no</span>
              </div>
              <div>
                <div className="mb-1">Lead ID</div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-normal focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={searchLeadId}
                  onChange={(e) => setSearchLeadId(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Name</div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-normal focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Budget</div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-normal focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={searchBudget}
                  onChange={(e) => setSearchBudget(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Contact no.</div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-normal focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={searchContact}
                  onChange={(e) => setSearchContact(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Status</div>
                <input 
                  type="text" 
                  placeholder="Search" 
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-normal focus:outline-none focus:ring-1 focus:ring-red-500"
                  value={searchStatus}
                  onChange={(e) => setSearchStatus(e.target.value)}
                />
              </div>
              <div>
                <div className="mb-1">Category</div>
                <select 
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs font-normal focus:outline-none focus:ring-1 focus:ring-red-500"
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
                    <input type="checkbox" className="w-4 h-4 mr-2" onClick={(e) => e.stopPropagation()} />
                    {index + 1}
                  </div>

                  {/* Lead ID */}
                  <div className="text-sm font-bold text-gray-900">{lead.leadId}</div>

                  {/* Name */}
                  <div className="text-sm font-bold text-gray-900">{lead.name}</div>

                  {/* Budget */}
                  <div className="text-sm font-semibold text-gray-700">{lead.budget}</div>

                  {/* Contact */}
                  <div className="text-sm text-gray-600">{lead.contactNo}</div>

                  {/* Status */}
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block text-center ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>

                  {/* Category */}
                  <div>
                    <span className={`px-3 py-1 rounded text-xs font-bold inline-block ${
                      lead.category === 'RESIDENTIAL' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {lead.category}
                    </span>
                  </div>

                  {/* Last Update */}
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedUpdate(expandedUpdate === lead.id ? null : lead.id);
                      }}
                      className="text-xs text-gray-600 hover:text-gray-900 text-left transition-colors"
                    >
                      {expandedUpdate === lead.id ? lead.lastUpdate.full : lead.lastUpdate.short}
                    </button>
                  </div>

                  {/* Assigned To */}
                  <div className="flex items-center gap-2">
                    <span className={`w-8 h-8 ${lead.assignedTo.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                      {lead.assignedTo.initial}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{lead.assignedTo.name}</span>
                  </div>

                  {/* Follow & Source */}
                  <div className="flex items-center gap-2">
                    <button className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded flex items-center justify-center transition-colors" onClick={(e) => e.stopPropagation()}>
                      <FiClipboard className="text-sm" />
                    </button>
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-sm font-bold ${
                      lead.source === 'Pinterest' ? 'bg-red-600 text-white' :
                      lead.source === 'Google' ? 'bg-white border-2 border-blue-500 text-blue-500' :
                      lead.source === 'Instagram' ? 'bg-pink-500 text-white' :
                      'bg-blue-600 text-white'
                    }`}>
                      {getSourceIcon(lead.source)}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={(e) => e.stopPropagation()}>
                      <FiMoreVertical className="text-lg" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedLead === lead.id && lead.siteDetails && (
                  <div className="bg-gray-50 border-t border-gray-200 px-4 py-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Site Details */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                            <FiMapPin />
                            Site Details
                          </span>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">Location</span>
                            <span className="text-gray-900">: {lead.siteDetails.location}</span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">Pincode</span>
                            <span className="text-gray-900">: {lead.siteDetails.pincode}</span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">Project Type</span>
                            <span className="text-gray-900">: {lead.siteDetails.projectType}</span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">Project Floor</span>
                            <span className="text-gray-900">: {lead.siteDetails.projectFloor}</span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">Current Condition</span>
                            <span className="text-gray-900">: {lead.siteDetails.currentCondition}</span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">Requirements</span>
                            <span className="text-gray-900">: {lead.siteDetails.requirements}</span>
                          </div>
                          <div className="grid grid-cols-[140px_1fr] gap-2">
                            <span className="font-bold text-gray-700">Duration of Project</span>
                            <span className="text-gray-900">: {lead.siteDetails.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="space-y-4">
                        {lead.rooms?.map((room, roomIndex) => (
                          <div key={roomIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold">{room.name}</span>
                              <div className="flex gap-4 text-xs font-semibold text-gray-700">
                                <span>Length: {room.dimensions.length}</span>
                                <span>Breadth: {room.dimensions.breadth}</span>
                                <span>Height: {room.dimensions.height}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                              {room.images.map((image, imgIndex) => (
                                <div key={imgIndex} className="relative group">
                                  <img
                                    src={image}
                                    alt={`${room.name} ${imgIndex + 1}`}
                                    className="w-full h-24 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
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
            <div className="text-center py-8 text-gray-500">
              No leads found matching your search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300"
            >
              <FiXCircle />
            </button>
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsManager;
