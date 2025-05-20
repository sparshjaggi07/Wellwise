import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DoctorRegistration from '../../../../../../build/contracts/DoctorRegistration.json';
import Web3 from "web3";

function EducationDetails({ setEducationSubmit, doctor }) {
    const { licenseNumber } = useParams();
    const [educationDetails, setEducationDetails] = useState({
        specialization: '',
        highestQualification: '',
        experience: '',
        medicalSchool: '',
        graduationYear: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                DoctorRegistration.abi,
                DoctorRegistration.networks[networkId].address
            );
             
            await contract.methods
                .registerDoctorEducationalDetails(
                    licenseNumber,
                    educationDetails.specialization,
                    educationDetails.highestQualification,
                    educationDetails.experience,
                    educationDetails.medicalSchool,
                    educationDetails.graduationYear
                )
                .send({ from: doctor.walletAddress });
                    
            console.log("Educational Details Submitted Successfully");
            setEducationSubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering Educational details.");
            console.log("Form Builder error:", error);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    const specializations = [
        "General Practitioner",
        "Cardiologist",
        "Neurologist",
        "Dermatologist",
        "Pediatrician",
        "Surgeon"
    ];

    const qualifications = [
        "MBBS",
        "MD",
        "DO",
        "PhD"
    ];

    const experienceOptions = [
        "Less than 1 year",
        "1-3 years",
        "4-6 years",
        "7-10 years",
        "10+ years",
    ];

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setEducationDetails((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800 mb-6">Education Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                        <div>
                            <label className="block text-sm text-gray-700">Medical School</label>
                            <input
                                type="text"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={educationDetails.medicalSchool}
                                onChange={(e) => handleInputChange(e, "medicalSchool")}
                            />
                        </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Highest Qualification</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={educationDetails.highestQualification}
                                onChange={(e) => handleInputChange(e, "highestQualification")}
                            >
                                <option value="">Select Qualification</option>
                                {qualifications.map((qualification) => (
                                    <option key={qualification} value={qualification}>
                                        {qualification}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="">
                            <label className="block text-sm text-gray-700">Specialization</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={educationDetails.specialization}
                                onChange={(e) => handleInputChange(e, "specialization")}
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map((specialization) => (
                                    <option key={specialization} value={specialization}>
                                        {specialization}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Experience</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={educationDetails.experience}
                                onChange={(e) => handleInputChange(e, "experience")}
                            >
                                <option value="">Select Experience</option>
                                {experienceOptions.map((experience) => (
                                    <option key={experience} value={experience}>
                                        {experience}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Graduation Year</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={educationDetails.graduationYear}
                                onChange={(e) => handleInputChange(e, "graduationYear")}
                            >
                                <option value="">Select Year</option>
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                <div className="flex flex-row justify-end items-center mt-6">
                    <button
                        type="submit"
                        className="bg-[#24454a] text-white font-albulaMedium px-14 py-3 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out"
                    >
                        Next
                    </button>
                </div>
            </form>
        </>
    );
}

export default EducationDetails;
