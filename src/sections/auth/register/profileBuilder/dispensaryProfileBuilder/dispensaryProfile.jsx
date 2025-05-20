import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DispensaryRegistration from '../../../../../build/contracts/DispensaryRegistration.json';
import Web3 from 'web3';
import WellWiseLogo from '/favicon.png';

import OwnerDetails from './forms/ownerDetails';
import DispensaryDetails from './forms/dispensaryDetails';

function Register() {
    const navigate = useNavigate();

    const { licenseNumber } = useParams();

    const [dispensary, setDispensary] = useState(null);
    const [connectedAccount, setConnectedAccount] = useState("");
    const [web3, setWeb3] = useState();
    const [contract, setContract] = useState();

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setConnectedAccount(accounts[0]);

                    const networkId = await web3Instance.eth.net.getId();
                    const deployedNetwork = DispensaryRegistration.networks[networkId];

                    if (deployedNetwork) {
                        const contractInstance = new web3Instance.eth.Contract(
                            DispensaryRegistration.abi,
                            deployedNetwork.address
                        );
                        setContract(contractInstance);

                        console.log("Doctor Smart contract loaded successfully.");

                        const dispensaryCredentials = await contractInstance.methods
                            .getDispensaryCredentials(licenseNumber)
                            .call();

                            console.log(dispensaryCredentials);

                            const formattedDetails = {
                                dispensaryName: dispensaryCredentials[0],
                                licenceNumber: dispensaryCredentials[1],
                                email: dispensaryCredentials[2],
                                walletAddress: dispensaryCredentials[3],
                            };

                            setDispensary(formattedDetails);
                    } else {
                        console.error("Dispensary Smart contract not deployed on the detected network.");
                    }
                } catch (error) {
                    console.error("Error accessing MetaMask or contract:", error);
                }
            } else {
                alert("MetaMask not detected. Please install the MetaMask extension.");
                console.error("MetaMask not detected. Please install the MetaMask extension.");
            }
        };

        init();
    }, []);    

    const [ownerSubmit, setOwnerSubmit] = useState(false);
    const [dispensarySubmit, setDispensarySubmit] = useState(false);
    
    return (
        <div className="h-screen w-screen bg-[#e6eaf0] sm:p-8 lg:py-8 flex items-center justify-center">
            <div className={`w-fit bg-white flex  p-8 sm:p-14 sm:rounded-[30px] sm:drop-shadow-lg`}>
                <div className="p-4">
                    {dispensary ? (
                        <div>
                            <section className="flex flex-col items-center">
                                <div id="header" className="w-full flex justify-start">
                                    <img src={WellWiseLogo} alt="Well Wise Logo" className="w-[75px] h-[75px]" />
                                    <div className="ml-6">
                                        <div className="w-full text-3xl text-start font-albulaBold">
                                            Welcome,
                                        </div>
                                        <div className="w-full text-3xl text-start font-albulaHeavy capitalize mt-1 text-[#24454a]">
                                            {dispensary.dispensaryName}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-[600px] h-[2px] mt-5 bg-slate-300 rounded-full"></div>
                                <div id="timeline" className="mt-8">
                                    <div className="w-[600px] flex justify-around items-center">
                                        <div className="w-[120px] font-albulaRegular text-sm text-center"> Owner <br /> Details </div>
                                        <div className="w-[120px] font-albulaRegular text-sm text-center"> Dispensary <br /> Details </div>
                                    </div>

                                    <div className="w-[600px] h-[7px] mt-6 bg-slate-300 rounded-full relative flex justify-around items-center">
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">1</div>
                                        <div className="w-[25px] h-[25px] flex justify-center items-center text-sm mb-2 font-albulaMedium rounded-full bg-white border-2 border-[#24452a]">2</div>
                                    </div>
                                </div>
                            </section>

                            <section className="mt-14">
                                {!ownerSubmit && !dispensarySubmit && <OwnerDetails setOwnerSubmit={setOwnerSubmit} dispensary={dispensary}/>}
                                {ownerSubmit && !dispensarySubmit && <DispensaryDetails setDispensarySubmit={setDispensarySubmit} dispensary={dispensary}/>}
                            </section>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500">Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;