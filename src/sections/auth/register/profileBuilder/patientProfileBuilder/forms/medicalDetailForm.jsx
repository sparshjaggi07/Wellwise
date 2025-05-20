import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import PatientRegistration from '../../../../../../build/contracts/PatientRegistration.json';

function MedicalDetails({setMedicalSubmit, patient}) {
    const { uniqueID } = useParams();
    const [healthID, setHealthID] = useState('');
    useEffect(() => {
        setHealthID(uniqueID);
    }, [uniqueID]);

    const [patientMedicalDetails, setPatientMedicalDetails] = useState({
        weight: 0,
        feet: 0,
        inches: 0,
        allergies: '',
        isDiabetic: false,
        isHypertension: false
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
                .registerPatientMedicalDetails(
                    healthID,
                    patientMedicalDetails.weight,
                    patientMedicalDetails.feet,
                    patientMedicalDetails.inches,
                    patientMedicalDetails.allergies,
                    patientMedicalDetails.isDiabetic,
                    patientMedicalDetails.isHypertension
                )
                .send({ from: patient.walletAddress });
                
            console.log("Medical Details Submitted Successfully");
            setMedicalSubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering Medical details.");
            console.log("Form Builder error:", error);
        }
    };

    const handleInputChange = (e, field) => {
        const { value, type, checked } = e.target;
        setPatientMedicalDetails((prevDetails) => ({
            ...prevDetails,
            [field]: type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800 mb-6">Medical Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Weight (kg)</label>
                        <input
                            type="number"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientMedicalDetails.weight}
                            onChange={(e) => handleInputChange(e, "weight")}
                        />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Height (Feet)</label>
                            <input
                                type="number"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientMedicalDetails.feet}
                                onChange={(e) => handleInputChange(e, "feet")}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Height (Inches)</label>
                            <input
                                type="number"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientMedicalDetails.inches}
                                onChange={(e) => handleInputChange(e, "inches")}
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Allergies</label>
                        <input
                            type="text"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientMedicalDetails.allergies}
                            onChange={(e) => handleInputChange(e, "allergies")}
                        />
                    </div>

                    <div className="mt-7 flex space-x-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-5 w-5 text-indigo-600"
                                checked={patientMedicalDetails.isDiabetic}
                                onChange={(e) => handleInputChange(e, "isDiabetic")}
                            />
                            <label className="ml-2 text-sm text-gray-700">Diabetic</label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="h-5 w-5 text-indigo-600"
                                checked={patientMedicalDetails.isHypertension}
                                onChange={(e) => handleInputChange(e, "isHypertension")}
                            />
                            <label className="ml-2 text-sm text-gray-700">Hypertension</label>
                        </div>
                    </div>
                </section>

                <div className="flex flex-row justify-end items-center mt-6">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="bg-[#24454a] text-white font-albulaMedium px-7 py-2 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out"
                    >
                        Next
                    </button>
                </div>
            </form>
        </>
    );
};

export default MedicalDetails;