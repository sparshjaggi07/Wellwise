import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DispensaryRegistration from '../../../build/contracts/DispensaryRegistration.json';
import Web3 from 'web3';

function DispensaryDashboard() {
    const { licenseNumber } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [dispensaryDetails, setDispensaryDetails] = useState(null);

    useEffect(() => {
        console.log("Updated Dispensary Details: ", dispensaryDetails);
    }, [dispensaryDetails]);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = DispensaryRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            DispensaryRegistration.abi,
                            deployedNetwork.address
                        );

                        const dispensaryCredentials = await contractInstance.methods
                            .getDispensaryCredentials(licenseNumber)
                            .call();
                        
                        const dispensaryOwnerDetails = await contractInstance.methods
                            .getDispensaryOwnerDetails(licenseNumber)
                            .call();
                        
                        const dispensaryContactDetails = await contractInstance.methods
                            .getDispensaryContactDetails(licenseNumber)
                            .call();

                        // Set state with the fetched data
                        setDispensaryDetails({
                            credentials: {
                                walletAddress: String(dispensaryCredentials[3]), // Ensuring wallet address is string
                                dispensaryName: String(dispensaryCredentials[0]),
                                licenseNumber: String(dispensaryCredentials[1]),
                                email: String(dispensaryCredentials[2]),
                            },
                            ownerDetails: {
                                ownerName: String(dispensaryOwnerDetails[0]),
                                ownerPhoneNumber: String(dispensaryOwnerDetails[1]),
                                ownerGender: String(dispensaryOwnerDetails[2]),
                                age: String(dispensaryOwnerDetails[3]),
                            },
                            contactDetails: {
                                contactNumber: String(dispensaryContactDetails[0]),
                                dispensaryWebsite: String(dispensaryContactDetails[1]),
                                operationalHours: String(dispensaryContactDetails[2]),
                            },
                        });
                    } else {
                        setError('Smart contract not deployed on the detected network.');
                    }
                } catch (err) {
                    setError('Error accessing MetaMask or fetching data.');
                }
            } else {
                setError('MetaMask not detected. Please install the MetaMask extension.');
            }
            setLoading(false);
        };

        init();
    }, [licenseNumber]);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    if (error) {
        return (
            <div className="text-red-500 bg-red-100 p-4 rounded-md mt-5 mx-auto max-w-md text-center">
                {error}
            </div>
        );
    }

    return (
        <div className="p-5 bg-green-50 min-h-screen">
            <h1 className="text-3xl font-bold text-green-700 text-center mb-5">
                Dispensary Dashboard
            </h1>
            <div className="max-w-4xl mx-auto space-y-5">
                <section className="bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Dispensary Credentials</h2>
                    <p><strong>Dispensary Name:</strong> {dispensaryDetails.credentials.dispensaryName}</p>
                    <p><strong>License Number:</strong> {dispensaryDetails.credentials.licenseNumber}</p>
                    <p><strong>Email:</strong> {dispensaryDetails.credentials.email}</p>
                    <p><strong>Wallet Address:</strong> {dispensaryDetails.credentials.walletAddress}</p>
                </section>

                <section className="bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Owner Details</h2>
                    <p><strong>Owner Name:</strong> {dispensaryDetails.ownerDetails.ownerName}</p>
                    <p><strong>Owner Phone Number:</strong> {dispensaryDetails.ownerDetails.ownerPhoneNumber}</p>
                    <p><strong>Owner Gender:</strong> {dispensaryDetails.ownerDetails.ownerGender}</p>
                    <p><strong>Owner Age:</strong> {dispensaryDetails.ownerDetails.age}</p>
                </section>

                <section className="bg-white shadow-md rounded-lg p-5">
                    <h2 className="text-2xl font-semibold text-green-600 mb-3">Contact Details</h2>
                    <p><strong>Contact Number:</strong> {dispensaryDetails.contactDetails.contactNumber}</p>
                    <p><strong>Website:</strong> {dispensaryDetails.contactDetails.dispensaryWebsite}</p>
                    <p><strong>Operational Hours:</strong> {dispensaryDetails.contactDetails.operationalHours}</p>
                </section>
            </div>
        </div>
    );
}

export default DispensaryDashboard;