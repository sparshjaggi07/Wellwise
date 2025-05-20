import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Web3 from "web3";
import DoctorRegistration from '../../../../../../build/contracts/DoctorRegistration.json';

function ProfessionalDetails({ setProfessionalSubmit, doctor }) {
    const { licenseNumber } = useParams();
    const navigate = useNavigate();
    const [doctorProfessionalDetails, setDoctorProfessionalDetails] = useState({
        hospitalName: '',
        designation: '',
        department: '',
        consultantFees: '',
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
                .registerDoctorProfessionalDetails(
                    licenseNumber,
                    doctorProfessionalDetails.hospitalName,
                    doctorProfessionalDetails.designation,
                    doctorProfessionalDetails.department,
                    doctorProfessionalDetails.consultantFees
                )
                .send({ from: doctor.walletAddress });
                    
            console.log("Professional Details Submitted Successfully");
            navigate("/doctor/" + licenseNumber);
            setProfessionalSubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering Professional details.");
            console.log("Form Builder error:", error);
        }
    };

    const designations = [
        "Consultant",
        "Junior Doctor",
        "Senior Doctor"
    ];

    const departments = [
        "Cardiology",
        "Neurology",
        "Dermatology",
        "Pediatrics",
        "Surgery",
    ];

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setDoctorProfessionalDetails((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800 mb-6">Professional Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Hospital Name</label>
                        <input
                            type="text"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={doctorProfessionalDetails.hospitalName}
                            onChange={(e) => handleInputChange(e, "hospitalName")}
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Designation</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={doctorProfessionalDetails.designation}
                                onChange={(e) => handleInputChange(e, "designation")}
                            >
                                <option value="">Select Designation</option>
                                {designations.map((designation) => (
                                    <option key={designation} value={designation}>
                                        {designation}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Department</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={doctorProfessionalDetails.department}
                                onChange={(e) => handleInputChange(e, "department")}
                            >
                                <option value="">Select Department</option>
                                {departments.map((department) => (
                                    <option key={department} value={department}>
                                        {department}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Consultant Fees</label>
                        <input
                            type="number"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={doctorProfessionalDetails.consultantFees}
                            onChange={(e) => handleInputChange(e, "consultantFees")}
                        />
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

export default ProfessionalDetails;