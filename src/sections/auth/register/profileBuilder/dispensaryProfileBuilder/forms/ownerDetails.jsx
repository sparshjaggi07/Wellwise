import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Web3 from "web3";
import DispensaryRegistration from '../../../../../../build/contracts/DispensaryRegistration.json';

function OwnerDetails({ setOwnerSubmit, dispensary }) {
    const {licenseNumber} = useParams();
    const [ownerDetails, setOwnerDetails] = useState({
        ownerName: '',
        ownerPhoneNumber: '',
        ownerGender: '',
        age: '',
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
                .registerDispensaryOwnerDetails(
                    licenseNumber,
                    ownerDetails.ownerName,
                    ownerDetails.ownerPhoneNumber,
                    ownerDetails.ownerGender,
                    ownerDetails.age
                )
                .send({ from: dispensary.walletAddress });
                    
            console.log("Owner Details Submitted Successfully");
            setOwnerSubmit(true);
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while registering Owner details.");
            console.log("Form Builder error:", error);
        }
    };

    const genders = ["Male", "Female", "Other"];

    const handleInputChange = (e, field) => {
        const { value } = e.target;
        setOwnerDetails((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    return (
        <>
            <h1 className="font-albulaSemiBold text-2xl text-center text-gray-800 mb-6">Owner Details</h1>
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg">
                <section>
                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Owner Name</label>
                        <input
                            type="text"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={ownerDetails.ownerName}
                            onChange={(e) => handleInputChange(e, "ownerName")}
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm text-gray-700">Owner Phone Number</label>
                        <input
                            type="text"
                            className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                            value={ownerDetails.ownerPhoneNumber}
                            onChange={(e) => handleInputChange(e, "ownerPhoneNumber")}
                            placeholder="e.g., 123-456-7890"
                        />
                    </div>

                    <div className="mt-4 flex space-x-4">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Owner Gender</label>
                            <select
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={ownerDetails.ownerGender}
                                onChange={(e) => handleInputChange(e, "ownerGender")}
                            >
                                <option value="">Select Gender</option>
                                {genders.map((gender) => (
                                    <option key={gender} value={gender}>
                                        {gender}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Age</label>
                            <input
                                type="number"
                                className="mt-1 p-3 border rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-indigo-500"
                                value={ownerDetails.age}
                                onChange={(e) => handleInputChange(e, "age")}
                                min="1"
                                placeholder="e.g., 30"
                            />
                        </div>
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

export default OwnerDetails;