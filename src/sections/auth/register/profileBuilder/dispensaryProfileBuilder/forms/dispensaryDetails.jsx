import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Web3 from "web3";
import DispensaryRegistration from '../../../../../../build/contracts/DispensaryRegistration.json';

function DispensaryContactDetails({setDispensarySubmit, dispensary}) {
    const { licenseNumber } = useParams();
    const navigate = useNavigate();
    const [dispensaryDetails, setDispensaryDetails] = useState({
        contactNumber: '',
        dispensaryWebsite: '',
        operationalHours: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const contract = new web3.eth.Contract(
                DispensaryRegistration.abi,
                DispensaryRegistration.networks[networkId].address
            );
             
            await contract.methods
                .registerDispensaryContactDetails(
                    licenseNumber,
                    dispensaryDetails.contactNumber,
                    dispensaryDetails.dispensaryWebsite,
                    dispensaryDetails.operationalHours
                )
                .send({ from: dispensary.walletAddress });
                    
            console.log("Dispensary Contact Details Submitted Successfully");
            navigate("/dispensary/" + licenseNumber);
            setDispensarySubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering Dispensary Contact details.");
            console.log("Form Builder error:", error);
        }
    };

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setDispensaryDetails((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const operationalHoursOptions = [
        "Mon-Sun 9:00 AM - 6:00 PM",
        "Mon-Fri 8:00 AM - 5:00 PM",
        "Mon-Sun 10:00 AM - 8:00 PM",
        "Mon-Fri 9:00 AM - 6:00 PM",
        "Sat-Sun 9:00 AM - 3:00 PM",
        "24/7",
    ];

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800 mb-6">Dispensary Contact Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                    <div className="mt-4 flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Contact Number</label>
                            <input
                                type="text"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={dispensaryDetails.contactNumber}
                                onChange={(e) => handleInputChange(e, "contactNumber")}
                                placeholder="e.g., 123-456-7890"
                            />
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Operational Hours</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={dispensaryDetails.operationalHours}
                                onChange={(e) => handleInputChange(e, "operationalHours")}
                            >
                                <option value="" disabled>Select operational hours</option>
                                {operationalHoursOptions.map((option, index) => (
                                    <option key={index} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Dispensary Website</label>
                        <input
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={dispensaryDetails.dispensaryWebsite}
                            onChange={(e) => handleInputChange(e, "dispensaryWebsite")}
                            placeholder="e.g., https://www.dispensary.com"
                        />
                    </div>
                </section>

                <div className="flex flex-row justify-end items-center mt-6">
                    <button
                        type="submit"
                        className="bg-[#24454a] text-white font-albulaMedium px-14 py-3 rounded-xl hover:bg-[#2d555b] transition-all ease-in-out"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </>
    );
}

export default DispensaryContactDetails;
