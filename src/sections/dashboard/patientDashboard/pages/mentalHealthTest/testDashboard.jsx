import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PatientRegistration from '../../../../../build/contracts/PatientRegistration.json';
import MentalHealth from '../../../../../build/contracts/MentalHealth.json';
import Web3 from 'web3';
import axios from "axios";

import deepFaceGraph from '/graph.jpg';

function TestDashboard() {
    const { healthID, testID } = useParams();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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
                const fetctEmotionDetails = await contract.methods
                    .getEmotionDetails(testID)
                    .call();

                setScores({
                    historyScore: fetchedAllScores[0],
                    phq9Score: fetchedAllScores[1],
                    sentimentalScore: fetchedAllScores[2],
                    videoScore: fetchedAllScores[3],
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

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://127.0.0.1:5000/depression_score',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : scores
    };
      
    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
    })
        .catch((error) => {
            console.log(error);
    });

    useEffect(() => {
        const history = scores.historyScore;
        const phq9 = scores.phq9Score;
        const sentimental = scores.sentimentalScore;
        const video = scores.videoScore;

        if (history && phq9 && sentimental && video) {
            const total = (0.1 * history + 0.6 * phq9 + 0.2 * sentimental + 0.1 * video) * 100;
            setTotalScore(Math.round(total));
        }
    }, [scores]);

    const [historyScore, setHistoryScore] = useState();
    useEffect(() => {
        const history = scores.historyScore;

        if (history) {
            const total = scores.historyScore * 100;
            setHistoryScore(Math.round(total));
        }
    }, [scores]);

    const [PHQ9Score, setPHQ9Score] = useState();
    useEffect(() => {
        const PHQ9Score = scores.phq9Score;

        if (PHQ9Score) {
            const total = scores.phq9Score * 100;
            setPHQ9Score(Math.round(total));
        }
    }, [scores]);

    const [sentimentalScore, setSentimentalScore] = useState();
    useEffect(() => {
        const SentimentalScore = scores.sentimentalScore;

        if (SentimentalScore) {
            const total = scores.sentimentalScore * 100;
            setSentimentalScore(Math.round(total));
        }
    }, [scores]);

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

    return (
        <>
            <div className="fixed w-[calc(100%-160px)] h-screen py-10 pr-10 font-albulaRegular">
                <div className="w-full h-[80px] bg-[#d4eceb] rounded-[30px] px-10 flex flex-row justify-between items-center">
                    <div>
                        <span className="font-albulabold text-2xl text-[#124444]">
                            Hey
                        </span>
                        <span className="font-albulaHeavy text-2xl ml-2 text-[#124444]">
                            User
                        </span>
                    </div>

                    <div>
                        <span className="font-albulaRegular text-xl">
                            Test ID:
                        </span>
                        <span className="font-albulaBold text-xl ml-2">
                            {testID}
                        </span>
                    </div>
                </div>

                <div className="font-albulaHeavy text-2xl text-[#124444] flex flex-row justify-center items-center mt-10">
                    Mental Health Test Summary
                </div>

                <div className="mt-10 w-full h-fit flex flex-row justify-between">
                    <div className="w-[700px] h-[500px] bg-[#d4eceb] rounded-[40px] flex flex-col justify-center items-center p-7">
                        <div className="bg-[#124444] w-full h-[80px] text-white rounded-3xl flex justify-center items-center font-albulaHeavy texl-3xl">SECTION SCORE'S</div>
                        <div className="w-full h-full mt-4">
                            <div className="mb-4">
                                History & Background:
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                <div
                                    className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${historyScore}%` }}
                                ></div>
                            </div>
                            <div className="text-right text-sm text-gray-700">
                                Score: {historyScore}%
                            </div>
                        </div>

                        <div className="w-full h-full mt-4">
                            <div className="mb-4">
                                PHQ9 Questionnaire:
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                <div
                                    className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${PHQ9Score}%` }}
                                ></div>
                            </div>
                            <div className="text-right text-sm text-gray-700">
                                Score: {PHQ9Score}%
                            </div>
                        </div>

                        <div className="w-full h-full mt-4">
                            <div className="mb-4">
                                Sentimental Analysis:
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                                <div
                                    className="bg-[#266666] h-2.5 rounded-full transition-all duration-300 ease-in-out"
                                    style={{ width: `${sentimentalScore}%` }}
                                ></div>
                            </div>
                            <div className="text-right text-sm text-gray-700">
                                Score: {sentimentalScore}%
                            </div>
                        </div>
                    </div>
                    <img src={deepFaceGraph} alt="Deep Face Graph" className="w-[800px] border-2 border-[#1a5252] rounded-[40px]"/>
                </div>

                <div className="w-full h-[130px] mt-10 rounded-[40px] flex flex-row justify-between items-center p-4">
                    <div className="h-[90px] w-[250px] bg-slate-500 flex justify-center items-center rounded-[40px]">
                        <span className="font-albulaSemiBold text-xl">Depression Score: </span>
                        <span className="font-albulaSemiBold text-xl">{depressionScore}</span>
                    </div>

                    <div className="h-[90px] w-[250px] bg-slate-500 flex justify-center items-center rounded-[40px]">
                        <span className="font-albulaSemiBold text-xl">Section One Scor: </span>
                        <span className="font-albulaSemiBold text-xl">{depressionScore}</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TestDashboard;