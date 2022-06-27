import React, { useEffect } from 'react';
import { Contract } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { useContext, useState } from "react";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "../lib/nftConstants";
import { DAO_CONTRACT_ADDRESS, DAO_CONTRACT_ABI } from "../lib/daoConstants";
import {WalletConnectContext} from '../Context/walletConnectContext';
import styles from "../styles/Home.module.css";

export default function Whitelist() {
  const [loading, setLoading] = useState(false);
  const [treasuryBalance, setTreasuryBalance] = useState("0");
  // Array of all proposals created in the DAO
  const [proposals, setProposals] = useState([]);
  const [numProposals, setNumProposals] = useState("0");
  const [nftBalance, setNftBalance] = useState(0);
  const [fakeNftTokenId, setFakeNftTokenId] = useState("");
  // One of "Create Proposal" or "View Proposals"
  const [selectedTab, setSelectedTab] = useState("");
  const { walletConnected, connectWallet, getProviderOrSigner } = useContext(WalletConnectContext);

  // interacting with functions of smartcontracts

  const getDAOTreasuryBalance = async () => {
    try {
      const provider = await getProviderOrSigner();
      const balance = await provider.getBalance(
        DAO_CONTRACT_ADDRESS
      );
      setTreasuryBalance(balance.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const getNumProposalsInDAO = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = getDaoContractInstance(provider);
      const daoNumProposals = await contract.numProposals();
      setNumProposals(daoNumProposals.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const getUserNFTBalance = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const nftContract = getNFTContractInstance(signer);
      const balance = await nftContract.balanceOf(signer.getAddress());
      setNftBalance(parseInt(balance.toString()));
    } catch (error) {
      console.error(error);
    }
  };

  
  const createProposal = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const txn = await daoContract.createProposal(fakeNftTokenId);
      setLoading(true);
      await txn.wait();
      await getNumProposalsInDAO();
      setLoading(false);
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };

  // Helper function to fetch and parse one proposal from the DAO contract
  // Given the Proposal ID
  // and converts the returned data into a Javascript object with values we can use
  const fetchProposalById = async (id) => {
    try {
      const provider = await getProviderOrSigner();
      const daoContract = getDaoContractInstance(provider);
      const proposal = await daoContract.proposals(id);
      const parsedProposal = {
        proposalId: id,
        nftTokenId: proposal.nftTokenId.toString(),
        deadline: new Date(parseInt(proposal.deadline.toString()) * 1000),
        yayVotes: proposal.yayVotes.toString(),
        nayVotes: proposal.nayVotes.toString(),
        executed: proposal.executed,
      };
      return parsedProposal;
    } catch (error) {
      console.error(error);
    }
  };

  
  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };

  
  const voteOnProposal = async (proposalId, _vote) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);

      let vote = _vote === "YAY" ? 0 : 1;
      const txn = await daoContract.voteOnProposal(proposalId, vote);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };


  const executeProposal = async (proposalId) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getDaoContractInstance(signer);
      const txn = await daoContract.executeProposal(proposalId);
      setLoading(true);
      await txn.wait();
      setLoading(false);
      await fetchAllProposals();
    } catch (error) {
      console.error(error);
      window.alert(error.data.message);
    }
  };

  // get contract instances
  
  const getDaoContractInstance = (providerOrSigner) => {
    return new Contract(
      DAO_CONTRACT_ADDRESS,
      DAO_CONTRACT_ABI,
      providerOrSigner
    );
  };

  
  const getNFTContractInstance = (providerOrSigner) => {
    return new Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_CONTRACT_ABI,
      providerOrSigner
    );
  };


  // initialize

  useEffect(()=>{
    if (walletConnected){
      getDAOTreasuryBalance();
      getUserNFTBalance();
      getNumProposalsInDAO();
  }
    },[walletConnected])

    useEffect(() => {
      if (selectedTab === "View Proposals") {
        fetchAllProposals();
      }
    }, [selectedTab]);
  
    // Render the contents of the appropriate tab based on `selectedTab`
    function renderTabs() {
      if (selectedTab === "Create Proposal") {
        return renderCreateProposalTab();
      } else if (selectedTab === "View Proposals") {
        return renderViewProposalsTab();
      }
      return null;
    }
  
    
    function renderCreateProposalTab() {
      if (loading) {
        return (
          <div>
            Loading... Waiting for transaction...
          </div>
        );
      } else if (nftBalance === 0) {
        return (
          <div>
            <h3>You do not own any MUN NFTs.</h3>
            <b>You cannot create or vote on proposals</b>
          </div>
        );
      } else {
        return (
          <div>
            <label>Fake NFT Token ID to Purchase: </label>
            <input
              placeholder="0"
              type="number"
              onChange={(e) => setFakeNftTokenId(e.target.value)}
            />
            <button className={styles.button2} onClick={createProposal}>
              Create
            </button>
          </div>
        );
      }
    }
  
    // Renders the 'View Proposals' tab content
    function renderViewProposalsTab() {
      if (loading) {
        return (
          <div>
            Loading... Waiting for transaction...
          </div>
        );
      } else if (proposals.length === 0) {
        return (
          <div>
            No proposals have been created
          </div>
        );
      } else {
        return (
          <div>
            {proposals.map((p, index) => (
              <div key={index}>
                <p>Proposal ID: {p.proposalId}</p>
                <p>Fake NFT to Purchase: {p.nftTokenId}</p>
                <p>Deadline: {p.deadline.toLocaleString()}</p>
                <p>Yay Votes: {p.yayVotes}</p>
                <p>Nay Votes: {p.nayVotes}</p>
                <p>Executed?: {p.executed.toString()}</p>
                {p.deadline.getTime() > Date.now() && !p.executed ? (
                  <div>
                    <button
                      onClick={() => voteOnProposal(p.proposalId, "YAY")}
                    >
                      Vote YAY
                    </button>
                    <button
                      onClick={() => voteOnProposal(p.proposalId, "NAY")}
                    >
                      Vote NAY
                    </button>
                  </div>
                ) : p.deadline.getTime() < Date.now() && !p.executed ? (
                  <div >
                    <button
                      onClick={() => executeProposal(p.proposalId)}
                    >
                      Execute Proposal{" "}
                      {p.yayVotes > p.nayVotes ? "(YAY)" : "(NAY)"}
                    </button>
                  </div>
                ) : (
                  <div>Proposal Executed</div>
                )}
              </div>
            ))}
          </div>
        );
      }
    }
  
    return (  
        <div className={styles.main}>
          <div>
            <h1>Welcome to Manchester United DAO!</h1>
            <div>
              Your MUN NFT Balance: {nftBalance}
              <br />
              Treasury Balance: {formatEther(treasuryBalance)} ETH
              <br />
              Total Number of Proposals: {numProposals}
            </div>
            <div>
              <button
                onClick={() => setSelectedTab("Create Proposal")}
              >
                Create Proposal
              </button>
              <button
                onClick={() => setSelectedTab("View Proposals")}
              >
                View Proposals
              </button>
            </div>
            {renderTabs()}
          </div>
        </div>
    );
}