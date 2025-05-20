import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import PatientRegistration from '../../../../../../build/contracts/PatientRegistration.json';

function ContactDetails({setContactSubmit, patient}) {
    const { uniqueID } = useParams();
    const [healthID, setHealthID] = useState('');
    useEffect(() => {
        setHealthID(uniqueID);
    }, [uniqueID]);

    const [patientContactDetails, setPatientContactDetails] = useState({
        contactNumber: 0,
        appartmentNumber: '',
        streetNumber: '',
        city: '',
        state: '',
        country: ''
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
                .registerPatientContactDetails(
                    healthID,
                    patientContactDetails.contactNumber,
                    patientContactDetails.appartmentNumber,
                    patientContactDetails.streetNumber,
                    patientContactDetails.city,
                    patientContactDetails.state,
                    patientContactDetails.country
                )
                .send({ from: patient.walletAddress });
                    
            console.log("Contact Details Submitted Successfully");
            setContactSubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering contact details.");
            console.log("Form Builder error:", error);
        }
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setPatientContactDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800 mb-6">Contact Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Contact Number</label>
                        <input
                            type="number"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientContactDetails.contactNumber}
                            onChange={(e) => handleInputChange(e, "contactNumber")}
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Apartment Number</label>
                        <input
                            type="text"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={patientContactDetails.appartmentNumber}
                            onChange={(e) => handleInputChange(e, "appartmentNumber")}
                        />
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Street Number</label>
                            <input
                                type="text"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientContactDetails.streetNumber}
                                onChange={(e) => handleInputChange(e, "streetNumber")}
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">City</label>
                            <input
                                type="text"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientContactDetails.city}
                                onChange={(e) => handleInputChange(e, "city")}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">State</label>
                            <input
                                type="text"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientContactDetails.state}
                                onChange={(e) => handleInputChange(e, "state")}
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Country</label>
                            <input
                                type="text"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={patientContactDetails.country}
                                onChange={(e) => handleInputChange(e, "country")}
                            />
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

export default ContactDetails;