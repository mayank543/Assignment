import React, { useState, useEffect } from "react";
import Select from "react-select";
import { User, Mail, Phone, Home, MapPin, Check } from "lucide-react";

export default function App() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    house: "",
    street: "",
    city: "",
    pincode: "",
    state: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setsubmitted] = useState(false);
  const [loadingPin, setloadingPin] = useState(false);

  const stateoptions = [
    { value: "", label: "Select State", isDisabled: true },
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
    { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Dadra and Nagar Haveli and Daman and Diu", label: "Dadra and Nagar Haveli and Daman and Diu" },
    { value: "Delhi", label: "Delhi" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
    { value: "Ladakh", label: "Ladakh" },
    { value: "Lakshadweep", label: "Lakshadweep" },
    { value: "Puducherry", label: "Puducherry" },
  ];

  const fetchPincodeDetails = async (pincode) => {
  if (pincode.length !== 6) return;
  
  setloadingPin(true);
  
  try {
    const resp = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await resp.json();
    
    if (data?.[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
      const postOffice = data[0].PostOffice[0];
      
      setFormData(prev => ({
        ...prev,
        city: postOffice.District,
        state: postOffice.State
      }));
      
      if (errors.city || errors.state) {
        setErrors(prev => ({
          ...prev,
          city: null,
          state: null
        }));
      }
    } else {
      setErrors(prev => ({
        ...prev,
        pincode: "Invalid pincode or no data available"
      }));
    }
  } catch (err) {
    console.error("Error fetching pincode data:", err);
    setErrors(prev => ({
      ...prev,
      pincode: "Error fetching pincode data. Please try again."
    }));
  } finally {
    setloadingPin(false);
  }
};

const validate = () => {
  const newErrors = {};
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;       ///aahhaahah
  const phoneRegex = /^\d{10}$/;
  const pincodeRegex = /^\d{6}$/;

  if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
  if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = "Enter a valid email address";
  }

  if (!formData.phone.trim()) {
    newErrors.phone = "Phone number is required";
  } else if (!phoneRegex.test(formData.phone)) {
    newErrors.phone = "Enter a valid 10-digit phone number";
  }

  if (!formData.house.trim()) {
    newErrors.house = "House number is required";
  } else if (formData.house.length > 40) {
    newErrors.house = "House number must not exceed 40 characters";
  }

  if (!formData.street.trim()) {
    newErrors.street = "Street area is required";
  } else if (formData.street.length > 80) {
    newErrors.street = "Street must not exceed 80 characters";
  }

  if (!formData.city.trim()) newErrors.city = "City is required";

  if (!formData.pincode.trim()) {
    newErrors.pincode = "Pincode is required";
  } else if (!pincodeRegex.test(formData.pincode)) {
    newErrors.pincode = "Pincode must be 6 digits";
  }

  if (!formData.state || formData.state === "Select State") {
    newErrors.state = "Please select a state";
  }

  return newErrors;
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (errors[name]) {
         setErrors({ ...errors, [name]: null });
    }
    
    if (name === "pincode") {
      if (value.length === 6 && /^\d{6}$/.test(value)) {
        fetchPincodeDetails(value);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setsubmitted(true);
      setTimeout(() => setsubmitted(false), 3000);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-blue-100 mt-2">Please fill in your information below</p>
        </div>
        
        {submitted ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <Check size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission Successful!</h2>
            <p className="text-gray-600 text-center">Thank you for submitting your details.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-6">
              
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2 text-blue-600" size={20} />
                  Personal Information
                </h2>
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First & Middle Name</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="e.g. Mayank Kumar"
                        className={`w-full p-3 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="e.g. Doholiya"
                        className={`w-full p-3 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Mail className="mr-1 text-blue-600" size={16} /> Email Address
                      </label>
                      <input
                        name="email"
                          value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. mayankdoholiya@gmail.com"
                        className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    
                    <div>
                      <label className="flex text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Phone className="mr-1 text-blue-600" size={16} /> Phone Number
                      </label>
                      <input
                         name="phone"
                         value={formData.phone}
                           onChange={handleChange}
                           placeholder="10-digit mobile number"
                           className={`w-full p-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              </div>

              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Home className="mr-2 text-blue-600" size={20} />
                  Residential Address
                </h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">House No. / Building</label>
                      <input
                        name="house"
                        value={formData.house}
                        maxLength={40}
                        onChange={handleChange}
                        placeholder="e.g. 123A"
                        className={`w-full p-3 border ${errors.house ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                      />
                      {errors.house && <p className="text-red-500 text-sm mt-1">{errors.house}</p>}
                    </div>

                    
                <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Street / Area</label>
                      <input
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        maxLength={80}
                        placeholder="e.g. Tilak nagar"
                        className={`w-full p-3 border ${errors.street ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2  focus:border-blue-500 transition duration-200`}
                      />
                      {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                      <div className="relative">
                        <input
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleChange}
                          placeholder="6-digit PIN"
                          className={`w-full p-3 border ${errors.pincode ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
                        />
                        {loadingPin && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                      </div>
                      {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                    </div>
                    
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MapPin className="mr-1 text-blue-600" size={16} /> City
                      </label>
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Jhansi"
                        readOnly={loadingPin}
                        className={`w-full p-3 border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ${formData.pincode.length === 6 ? 'bg-gray-50' : ''}`}
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                  </div>

                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <Select
                      options={stateoptions}
                      value={stateoptions.find((option) => option.value === formData.state)}
                      onChange={(selectedOption) => {
                        setFormData({ ...formData, state: selectedOption.value });
                        if (errors.state) {
                          setErrors({ ...errors, state: null });
                        }
                      }}
                      placeholder="Select your state"
                      isDisabled={loadingPin}
                      className={errors.state ? "border-red-500 rounded-lg" : ""}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          padding: "6px",
                          borderRadius: "0.5rem",
                          borderColor: errors.state ? "#ef4444" : state.isFocused ? "#3b82f6" : "#d1d5db",
                          boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.4)" : "none",
                          "&:hover": {
                            borderColor: state.isFocused ? "#3b82f6" : "#9ca3af",
                          },
                          backgroundColor: formData.pincode.length === 6 ? "#f9fafb" : "white",
                          transition: "all 0.2s",
                        }),
                        menu: (base) => ({
                          ...base,
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                          zIndex: 10,
                        }),
                        menuList: (base) => ({
                          ...base,
                          padding: "4px",
                          maxHeight: "250px", 
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected 
                            ? "#3b82f6" 
                            : state.isFocused 
                              ? "#dbeafe" 
                              : "white",
                          color: state.isSelected ? "white" : "#111827",
                          padding: "10px 12px",
                          borderRadius: "0.375rem",
                          marginBottom: "5px",
                          cursor: "pointer",
                          fontWeight: state.isSelected ? "400" : "normal",
                          "&:active": {
                            backgroundColor: "#bfdbfe",
                          },
                          "&:last-child": {
                            marginBottom: 0,
                          }
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#6b7280",
                        }),
                        singleValue: (base) => ({
                          ...base,
                          color: "#1f2937",
                        }),
                        dropdownIndicator: (base, state) => ({
                          ...base,
                          color: state.isFocused ? "#3b82f6" : "#6b7280",
                          transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : null,
                          transition: "all 0.2s ease",
                        }),
                        indicatorSeparator: () => ({
                          display: "none",
                        }),
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: '#3b82f6',
                          primary25: '#dbeafe',
                          primary50: '#bfdbfe',
                          neutral20: '#d1d5db',
                          neutral30: '#9ca3af',
                        },
                      })}
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>
              </div>
            </div>

            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                Submit Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}