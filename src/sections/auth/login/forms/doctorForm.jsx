import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';
import DoctorRegistration from "../../../../build/contracts/DoctorRegistration.json";

function DoctorLogin({ setIsRegistered, setDoctorDetails }) {
    const [doctorCredentials, setDoctorCredentials] = useState({
        licenseNumber: '',
        password: '',
    });

    const navigate = useNavigate();

    const handleDoctorSubmit = async (e) => {
        e.preventDefault();

        const doctorLicenceNumber = doctorCredentials.licenseNumber;
        const doctorPassword = doctorCredentials.password;

        try {
            console.log(`Starting login for Medical License Number: ${doctorLicenceNumber}`);

            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = DoctorRegistration.networks[networkId];
            const contract = new web3.eth.Contract(
                DoctorRegistration.abi,
                deployedNetwork && deployedNetwork.address
            );

            console.log("Checking if doctor is registered...");
            const isRegisteredResult = await contract.methods
                .isDoctorRegistered(doctorLicenceNumber)
                .call();
            console.log("Is Registered:", isRegisteredResult);

            setIsRegistered(isRegisteredResult);

            if (isRegisteredResult) {
                console.log("Doctor is registered, validating password...");
                const isValidPassword = await contract.methods
                    .validatePassword(doctorLicenceNumber, doctorPassword)
                    .call();
                console.log("Is Valid Password:", isValidPassword);

                if (isValidPassword) {
                    const fetchDoctorDetails = await contract.methods
                        .getDoctorCredentials(doctorLicenceNumber)
                        .call();
                    console.log("Doctor details:", fetchDoctorDetails);
                    console.log('Login successful');
                    console.log('Redirecting....');
                    navigate("/doctor/" + doctorLicenceNumber);
                } else {
                    console.log("Password validation failed");
                    alert("Incorrect password");
                }
            } else {
                console.log("Doctor not registered");
                alert("Doctor not registered");
            }
        } catch (error) {
            console.error("Error during login process:", error);
            alert("An error occurred while checking registration.");
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctorCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <form onSubmit={handleDoctorSubmit} className="space-y-4">
            <div className="relative">
                <input
                    type="text"
                    name="licenseNumber"
                    value={doctorCredentials.licenseNumber}
                    onChange={handleInputChange}
                    placeholder="Medical License Number"
                    className="w-full px-7 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <div className="relative">
                <input
                    type="password"
                    name="password"
                    value={doctorCredentials.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className="w-full px-7 py-3 rounded-full bg-gray-100 border-0 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none"
                />
            </div>

            <div>
                <button type="submit" className="group w-full mt-5 bg-[#1a3235] text-white px-4 py-3 rounded-full font-albulaBold hover:bg-[#2d555b] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all ease-in-out duration-200">
                    <div className="flex items-center justify-center relative">
                        <span className="absolute"> Login </span>
                        <svg className="w-5 h-5 ml-16 relative transform transition-all duration-200 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </button>
            </div>
        </form>
    );
}

export default DoctorLogin;