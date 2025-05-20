import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import PatientRegistration from '../../../../../../build/contracts/PatientRegistration.json';

function InsuranceDetails({setInsuranceSubmit, patient}) {
    const { uniqueID } = useParams();
    const [healthID, setHealthID] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        setHealthID(uniqueID);
    }, [uniqueID]);

    const [patientInsuranceDetails, setPatientInsuranceDetails] = useState({
        insuranceProvider: '',
        policyNumber: 0
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
                .registerPatientPolicyDetails(
                    healthID,
                    patientInsuranceDetails.insuranceProvider,
                    patientInsuranceDetails.policyNumber
                )
                .send({ from: patient.walletAddress });
                    
            console.log("Insurance Details Submitted Successfully");
            navigate("/patient/" + healthID);
            setInsuranceSubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering personal details.");
            console.log("Form Builder error:", error);
        }
    };


    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setPatientInsuranceDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800 mb-6">Insurance Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Insurance Provider</label>
                        <input
                            type="text"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientInsuranceDetails.insuranceProvider}
                            onChange={(e) => handleInputChange(e, "insuranceProvider")}
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Policy Number</label>
                        <input
                            type="number"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientInsuranceDetails.policyNumber}
                            onChange={(e) => handleInputChange(e, "policyNumber")}
                        />
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

export default InsuranceDetails;