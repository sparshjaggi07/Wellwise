// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract MentalHealth {
    struct PatientCredentials {
        address cryptoWalletAddress;
        string healthID;
        string testID;
    }

    struct mhtChildhoodDetails {
        string questionOne;
        string questionTwo;
        string questionThree;
        string questionFour;
        string questionFive;
        string questionSix;
        string questionSeven;
        string score;
    }

    struct mhtPHQ9Details {
        string questionOne;
        string questionTwo;
        string questionThree;
        string questionFour;
        string questionFive;
        string questionSix;
        string questionSeven;
        string questionEight;
        string questionNine;
        string score;
    }

    struct SentimentDetails {
        string textSentiment;
        string audioHash;
        string sentimentOne;
        string sentimentTwo;
        string score;
    }

    struct VideoAnalysis {
        string totalBlinkCount;
        string blinkPerMinute;
        string cvScore;
    }

    struct PatientMHTest {
        PatientCredentials credentials;
        mhtChildhoodDetails mhtcd;
        mhtPHQ9Details mhtphqDetails;
        SentimentDetails sentimentDetails;
        VideoAnalysis videoDetails;
        string finalScore;
    }

    mapping(string => string[]) private healthIDToTestIDs;
    mapping(string => PatientMHTest) private testIDToPatientTest;

    function initializePatientMHTest( string memory _healthID, string memory _testID, address _cryptoWalletAddress ) public {
        require(bytes(testIDToPatientTest[_testID].credentials.testID).length == 0, "TestID already exists");

        healthIDToTestIDs[_healthID].push(_testID);

        testIDToPatientTest[_testID] = PatientMHTest({
            credentials: PatientCredentials({
                healthID: _healthID,
                testID: _testID,
                cryptoWalletAddress: _cryptoWalletAddress
            }),
            mhtcd: mhtChildhoodDetails("", "", "", "", "", "", "", ""),
            mhtphqDetails: mhtPHQ9Details("", "", "", "", "", "", "", "", "", ""),
            sentimentDetails: SentimentDetails("", "", "", "", ""),
            videoDetails: VideoAnalysis("", "", ""),
            finalScore: ""
        });
    }

    function initializeChildhoodDetails( string memory _testID, string memory _questionOne, string memory _questionTwo, string memory _questionThree, string memory _questionFour, string memory _questionFive,string memory _questionSix, string memory _questionSeven, string memory _score ) public {
        mhtChildhoodDetails memory mhtcd = mhtChildhoodDetails({
            questionOne: _questionOne,
            questionTwo: _questionTwo,
            questionThree: _questionThree,
            questionFour: _questionFour,
            questionFive: _questionFive,
            questionSix: _questionSix,
            questionSeven: _questionSeven,
            score: _score
        });

        testIDToPatientTest[_testID].mhtcd = mhtcd;
    }

    function initializePHQ9Details( string memory _testID, string memory _questionOne, string memory _questionTwo, string memory _questionThree, string memory _questionFour, string memory _questionFive, string memory _questionSix, string memory _questionSeven, string memory _questionEight, string memory _questionNine, string memory _score ) public {
        mhtPHQ9Details memory mhtphqDetails = mhtPHQ9Details({
            questionOne: _questionOne,
            questionTwo: _questionTwo,
            questionThree: _questionThree,
            questionFour: _questionFour,
            questionFive: _questionFive,
            questionSix: _questionSix,
            questionSeven: _questionSeven,
            questionEight: _questionEight,
            questionNine: _questionNine,
            score: _score
        });

        testIDToPatientTest[_testID].mhtphqDetails = mhtphqDetails;
    }

    function initializeSentimentDetails( string memory _testID, string memory _text, string memory _hash, string memory _sentimentOne, string memory _sentimentTwo, string memory _score ) public {
        SentimentDetails memory sentimentDetails = SentimentDetails({
            textSentiment: _text,
            audioHash: _hash,
            sentimentOne: _sentimentOne,
            sentimentTwo: _sentimentTwo,
            score: _score
        });

        testIDToPatientTest[_testID].sentimentDetails = sentimentDetails;
    }

    function initializeEmotionDetails( string memory _testID, string memory _totalBlink, string memory _blinkPerMinute, string memory _cvScore) public {
        VideoAnalysis memory EmotionalDetails = VideoAnalysis({
            totalBlinkCount: _totalBlink,
            blinkPerMinute: _blinkPerMinute,
            cvScore: _cvScore
        });

        testIDToPatientTest[_testID].videoDetails = EmotionalDetails;
    }

    function setFinalScore(string memory _testID, string memory _score) public {
        testIDToPatientTest[_testID].finalScore = _score;
    }

    function getAllTestIDs(string memory _healthID)  public view  returns (string[] memory _testIDs)  {
        return healthIDToTestIDs[_healthID];
    }

    function getChildhoodDetails(string memory _testID)  public view  returns ( string memory _questionOne, string memory _questionTwo, string memory _questionThree, string memory _questionFour, string memory _questionFive, string memory _questionSix, string memory _questionSeven, string memory _score ) {
        mhtChildhoodDetails memory details = testIDToPatientTest[_testID].mhtcd;
        return (
            details.questionOne,
            details.questionTwo,
            details.questionThree,
            details.questionFour,
            details.questionFive,
            details.questionSix,
            details.questionSeven,
            details.score
        );
    }

    function getPHQ9Details(string memory _testID)  public view  returns ( string memory _questionOne, string memory _questionTwo, string memory _questionThree, string memory _questionFour, string memory _questionFive, string memory _questionSix, string memory _questionSeven, string memory _questionEight, string memory _questionNine, string memory _score )  {
        mhtPHQ9Details memory details = testIDToPatientTest[_testID].mhtphqDetails;
        return (
            details.questionOne,
            details.questionTwo,
            details.questionThree,
            details.questionFour,
            details.questionFive,
            details.questionSix,
            details.questionSeven,
            details.questionEight,
            details.questionNine,
            details.score
        );
    }

    function getSentimentDetails(string memory _testID)  public view  returns ( string memory _textSentiment, string memory _audioHash, string memory _sentimentOne, string memory _sentimentTwo, string memory _score ) {
        SentimentDetails memory details = testIDToPatientTest[_testID].sentimentDetails;
        return (
            details.textSentiment,
            details.audioHash,
            details.sentimentOne,
            details.sentimentTwo,
            details.score
        );
    }

    function getEmotionDetails(string memory _testID) public view returns (string memory _blinkCount, string memory _blinkPerMinute, string memory _cvScore){
        VideoAnalysis memory vanalysis = testIDToPatientTest[_testID].videoDetails;
        return (
            vanalysis.totalBlinkCount,
            vanalysis.blinkPerMinute,
            vanalysis.cvScore
        );
    }

    function getAllScores(string memory _testID)  public view  returns (string memory _historyScore, string memory _phq9Score, string memory _sentimentalScore, string memory _videoScore, string memory _finalScore) {
        return (
            testIDToPatientTest[_testID].mhtcd.score,
            testIDToPatientTest[_testID].mhtphqDetails.score,
            testIDToPatientTest[_testID].sentimentDetails.score,
            testIDToPatientTest[_testID].videoDetails.cvScore,
            testIDToPatientTest[_testID].finalScore
        );
    }

    function getCompleteTestDetails(string memory _testID)  public view  returns (address _cryptoWalletAddress,string memory _healthID,string memory _childhoodScore,string memory _phq9Score,string memory _sentimentalScore )  {
        PatientMHTest memory testDetails = testIDToPatientTest[_testID];
        return (
            testDetails.credentials.cryptoWalletAddress,
            testDetails.credentials.healthID,
            testDetails.mhtcd.score,
            testDetails.mhtphqDetails.score,
            testDetails.sentimentDetails.score
        );
    }
}