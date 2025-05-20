import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import PatientRegistration from '../../../../../../build/contracts/PatientRegistration.json';

function PersonalDetails({setPersonalSubmit, patient}) {
    const { uniqueID } = useParams();
    const [healthID, setHealthID] = useState('');
    useEffect(() => {
        setHealthID(uniqueID);
    }, [uniqueID]);

    const [patientPersonalDetails, setPatientPersonalDetails] = useState({
        gender: 'male',
        age: 0,
        date: 1,
        month: 1,
        year: 2000,
        maritalStatus: 'single',
        disabilities: "NA",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                PatientRegistration.abi,
                PatientRegistration.networks[networkId].address
            );
             
            await contract.methods
                .registerPatientPersonalDetails(
                    healthID,
                    patientPersonalDetails.gender,
                    patientPersonalDetails.age,
                    patientPersonalDetails.date,
                    patientPersonalDetails.month,
                    patientPersonalDetails.year,
                    patientPersonalDetails.maritalStatus,
                    patientPersonalDetails.disabilities
                )
                .send({ from: patient.walletAddress });
                
            console.log("Personal Details Submitted Successfully");
            setPersonalSubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering personal details.");
            console.log("Form Builder error:", error);
        }
    };

    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    
    const handleInputChange = (e, field) => {
        const { value } = e.target;

        if (field === "age" && !/^\d*$/.test(value)) {
            return;
        }

        setPatientPersonalDetails((prevState) => ({
            ...prevState,
            [field]: value
    }));
};

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800">Personal Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Gender</label>
                        <select
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientPersonalDetails.gender}
                            onChange={(e) => handleInputChange(e, "gender")}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Age</label>
                            <input
                                type="number"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientPersonalDetails.age}
                                onChange={(e) => handleInputChange(e, "age")}
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Marital Status</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientPersonalDetails.maritalStatus}
                                onChange={(e) => handleInputChange(e, "maritalStatus")}
                            >
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorced">Divorced</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Date</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientPersonalDetails.date}
                                onChange={(e) => handleInputChange(e, "date")}
                            >
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Month</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientPersonalDetails.month}
                                onChange={(e) => handleInputChange(e, "month")}
                            >
                                {months.map((month, index) => (
                                    <option key={month} value={index + 1}>{month}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Year</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientPersonalDetails.year}
                                onChange={(e) => handleInputChange(e, "year")}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Disabilities</label>
                        <input
                            type="text"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientPersonalDetails.disabilities}
                            onChange={(e) => handleInputChange(e, "disabilities")}
                        />
                    </div>
                </section>

                <div className="flex flex-row justify-end items-center mt-6">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-[#24454a] text-white font-albulaMedium px-14 py-3 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out"
                    >
                        Next
                    </button>
                </div>
            </form>
        </>
    );
};

export default PersonalDetails;