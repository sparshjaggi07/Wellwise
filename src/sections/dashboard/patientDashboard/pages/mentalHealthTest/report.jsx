import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import MentalHealth from '../../../../../build/contracts/MentalHealth.json';
import PatientRegistration from '../../../../../build/contracts/PatientRegistration.json';
import '../../../../../globalStyles.css';
import axios from "axios";
import gemini from '/animations/gemini.gif';

import Web3 from 'web3';

function Report() {
    const { healthID, testID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [scores, setScores] = useState({
        historyScore: '',
        phq9Score: '',
        sentimentalScore: '',
        videoScore: ''
    });

    const [childHoodDetails, setChildHoodDetails] = useState({
        question1: '',
        question2: '',
        question3: '',
        question4: '',
        question5: '',
        question6: '',
        question7: '',
        score: ''
    });

    const [phq9Details, setphq9Details] = useState({
        question1: '',
        question2: '',
        question3: '',
        question4: '',
        question5: '',
        question6: '',
        question7: '',
        question8: '',
        question9: '',
        score: ''
    });

    const [sentimentalDetails, setSentimentalDetails] = useState({
        test1: '',
        test2: '',
        analysisText1: '',
        analysisText2: '',
        score: ''
    });

    const [totalScore, setTotalScore] = useState(0);
    const [patientDetails, setPatientDetails] = useState(null);

    useEffect(() => {
        console.log("Updated Patient Details: ", patientDetails);
    }, [patientDetails]);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const web3Instance = new Web3(window.ethereum);
                try {
                    await window.ethereum.enable();
    
                    const networkId = await web3Instance.eth.net.getId();
                    const patientDeployedNetwork = PatientRegistration.networks[networkId];
    
                    if (patientDeployedNetwork) {
                        const patientContract = new web3Instance.eth.Contract(
                            PatientRegistration.abi,
                            patientDeployedNetwork.address
                        );
    
                        const patientCredentials = await patientContract.methods
                            .getPatientCredentials(healthID)
                            .call();
    
                        const patientPersonalDetails = await patientContract.methods
                            .getPatientPersonalDetails(healthID)
                            .call();
    
                        setPatientDetails({
                            credentials: {
                                walletAddress: patientCredentials[0],
                                name: String(patientCredentials[1]),
                                healthID: String(patientCredentials[2]),
                                email: String(patientCredentials[3]),
                            },
                            personalDetails: {
                                gender: String(patientPersonalDetails[0]),
                                age: patientPersonalDetails[1],
                                date: String(patientPersonalDetails[2]),
                                month: String(patientPersonalDetails[3]),
                                year: String(patientPersonalDetails[4]),
                                maritalStatus: String(patientPersonalDetails[5]),
                                disabilities: String(patientPersonalDetails[6]),
                            }
                        });
                    } else {
                        setError('PatientRegistration smart contract not deployed on the detected network.');
                    }
                } catch (err) {
                    console.error(err);
                    setError('Error accessing MetaMask or fetching data.');
                }
            } else {
                setError('MetaMask not detected. Please install the MetaMask extension.');
            }
            setLoading(false);
        };
    
        init();
    }, [healthID]);

    const [response, setResponse] = useState();

    useEffect(() => {
        const init = async () => {
            if (!window.ethereum) {
                setError('MetaMask not detected. Please install the MetaMask extension.');
                setLoading(false);
                return;
            }

            const web3Instance = new Web3(window.ethereum);
            try {
                await window.ethereum.enable();

                const networkId = await web3Instance.eth.net.getId();
                const contractAddress = MentalHealth.networks[networkId]?.address;

                if (!contractAddress) {
                    setError('MentalHealth smart contract not deployed on the detected network.');
                    setLoading(false);
                    return;
                }

                const contract = new web3Instance.eth.Contract(
                    MentalHealth.abi,
                    contractAddress
                );

                const fetchedAllScores = await contract.methods
                    .getAllScores(testID)
                    .call();
                const fetchedChildhoodDetails = await contract.methods
                    .getChildhoodDetails(testID)
                    .call();
                const fetchedPHQ9Details = await contract.methods
                    .getPHQ9Details(testID)
                    .call();
                const fetchSentimentDetails = await contract.methods
                    .getSentimentDetails(testID)
                    .call();

                setScores({
                    historyScore: parseFloat(fetchedAllScores[0]) || 0,
                    phq9Score: parseFloat(fetchedAllScores[1]) || 0,
                    sentimentalScore: parseFloat(fetchedAllScores[2]) || 0,
                    videoScore: parseFloat(fetchedAllScores[3]) || 0,
                });

                setChildHoodDetails(fetchedChildhoodDetails);
                setphq9Details(fetchedPHQ9Details);
                setSentimentalDetails(fetchSentimentDetails);

                console.log(`Details for Test ID ${testID}:`);
                console.log(fetchedAllScores);
                console.log(fetchedChildhoodDetails);
                console.log(fetchedPHQ9Details);
                console.log(fetchSentimentDetails);
            } catch (err) {
                console.error(err);
                setError('Error accessing MetaMask or fetching data.');
            }
            setLoading(false);
        };

        init();
    }, [testID]);

    useEffect(() => {
        console.log('Updated Scores:', scores);
    }, [scores]);

    useEffect(() => {
        const history = parseFloat(scores.historyScore) || 0;
        const phq9 = parseFloat(scores.phq9Score) || 0;
        const sentimental = parseFloat(scores.sentimentalScore) || 0;
        const video = parseFloat(scores.videoScore) || 0;

        if (history && phq9 && sentimental && video) {
            const total = (0.1 * history + 0.6 * phq9 + 0.2 * sentimental + 0.1 * video) * 100;
            setTotalScore(Math.round(total));
        }
    }, [scores]);

    useEffect(() => {
        console.log('Updated Total Score:', totalScore);
    }, [totalScore]);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return (
            <div className="text-red-500 bg-red-100 p-4 rounded-md mt-5 mx-auto max-w-md text-center">
                {error}
            </div>
        );
    }

    const numericalHistoryScore = parseFloat(scores.historyScore).toFixed(3);
    const numericalPHQ9Score = parseFloat(scores.phq9Score).toFixed(3);
    const numericalSentimentalScore = parseFloat(scores.sentimentalScore).toFixed(3);
    const numericalVideoScore = parseFloat(scores.videoScore).toFixed(3);

    const depressionScore = Math.round((0.2*numericalHistoryScore + 0.5*numericalPHQ9Score + 0.2*numericalSentimentalScore + 0.1*numericalVideoScore) * 100);

    const handleSubmit = async () => {
        if (!patientDetails) {
            setError('Patient details are not loaded yet.');
            return;
        }
    
        const requestData = {
            name: patientDetails.credentials.name,
            gender: patientDetails.personalDetails.gender,
            depScore: depressionScore,
        };
    
        try {
            const result = await axios.post('http://127.0.0.1:5000/results', requestData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(result);
            setResponse(result.data);
        } catch (err) {
            console.error("Error sending data:", err);
            setError(err.message);
        }
    };
    

    return (
        <>
            <div className="w-full min-h-screen bg-green-50 p-6 md:p-12 font-sans">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-4 animate-gemini">
                            Depression Score
                        </h1>

                        <div className="inline-block bg-white rounded-2xl border-4 border-green-600 p-6 shadow-lg">
                            <span className="text-5xl md:text-7xl font-bold text-green-600 animate-pulse">
                                {depressionScore} / 100
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" >
                            Get Advice
                        </button>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
                        {response ? (
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold text-green-800 animate-gemini">
                                    Advice for {response.name}
                                </h2>

                                <p className="text-xl text-green-600 font-semibold animate-gemini">
                                    Severity: {response.severity}
                                </p>

                                <ol className="list-decimal list-inside space-y-2">
                                    {response.advice.slice(0, 10).map((step, index) => (
                                    <li key={index} className="text-lg animate-gemini">
                                        <span className="font-bold">Step {step.step}:</span> {step.description}
                                    </li>
                                    ))}
                                </ol>
                            </div>
                        ) : (
                            <p className="text-xl text-center text-gray-600 animate-pulse">
                                Waiting for advice...
                            </p>
                        )}
                    </div>

                    <div className="text-center">
                        <Link to={`/patient/${healthID}/mht/${testID}`} className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50" >
                            DONE
                        </Link>
                    </div>
                </div>

                <img src={gemini} alt="" className="w-[500px] absolute top-36 -left-10"/>
            </div>
        </>
    );
}

export default Report;
