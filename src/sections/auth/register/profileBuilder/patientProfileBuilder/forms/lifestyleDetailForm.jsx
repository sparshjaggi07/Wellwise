import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import PatientRegistration from '../../../../../../build/contracts/PatientRegistration.json';

function LifeStyleDetails({setLifeStyleSubmit, patient}) {
    const { uniqueID } = useParams();
    const [healthID, setHealthID] = useState('');
    useEffect(() => {
        setHealthID(uniqueID);
    }, [uniqueID]);

    const [patientLifeStyleDetails, setPatientLifeStyleDetails] = useState({
        smokingStatus: '',
        alcoholConsumption: '',
        exerciseHabit: ''
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
                .registerPatientLifestyleDetails(
                    healthID,
                    patientLifeStyleDetails.smokingStatus,
                    patientLifeStyleDetails.alcoholConsumption,
                    patientLifeStyleDetails.exerciseHabit
                )
                .send({ from: patient.walletAddress });
                
            console.log("LifeStyle Details Submitted Successfully");
            setLifeStyleSubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering LifeStyle details.");
            console.log("Form Builder error:", error);
        }
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setPatientLifeStyleDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800 mb-6">LifeStyle Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Smoking Status</label>
                        <select
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientLifeStyleDetails.smokingStatus}
                            onChange={(e) => handleInputChange(e, "smokingStatus")}
                        >
                            <option value="">Select</option>
                            <option value="smoker">Smoker</option>
                            <option value="non-smoker">Non-Smoker</option>
                            <option value="occasional">Occasional Smoker</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Alcohol Consumption</label>
                        <select
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientLifeStyleDetails.alcoholConsumption}
                            onChange={(e) => handleInputChange(e, "alcoholConsumption")}
                        >
                            <option value="">Select</option>
                            <option value="regular">Regular</option>
                            <option value="occasional">Occasional</option>
                            <option value="none">None</option>
                        </select>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Exercise Habit</label>
                        <select
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientLifeStyleDetails.exerciseHabit}
                            onChange={(e) => handleInputChange(e, "exerciseHabit")}
                        >
                            <option value="">Select</option>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="never">Never</option>
                        </select>
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

export default LifeStyleDetails;