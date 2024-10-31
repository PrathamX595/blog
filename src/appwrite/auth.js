import config from "../config/config";
import { Client, Account, ID } from "appwrite";

export class AuthService{
    client = new Client();
    account;

    constructor(){
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjID);
        this.account = new Account(this.client);
    }

    async createAccount({email, password, name, loginUrl}){
        try {
           const userAccount = await this.account.create(ID.unique(), email, password, name);
           const user = await userAccount.updateMFA(true);
           await this.createEmailVerification(loginUrl);
           if (user) {
            return this.login({email, password});
           } else {
            return userAccount;
           }
        } catch (error) {
            console.log("Appwrite service :: createAccount :: error", error);
        }
    }

    async createEmailVerification({loginUrl}){
        try {
            return await this.account.createEmailVerification(loginUrl);
        } catch (error) {
            console.log("Appwrite service :: createEmailVerification :: error", error);
        }
    }

    async updateEmailVerification(UserID, secrets){
        try {
            return await this.account.updateVerification(UserID,secrets);
        } catch (error) {
            console.log("Appwrite service :: createEmailVerification :: error", error);
        }
    }
    
    async login({email, password}){
        try {
           return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            console.log("Appwrite service :: login :: error", error);
        }
    }

    //2FA via email
    async twoFactorAuth(){
        try {
            return await this.account.createMfaChallenge(AuthenticationFactor.Email);
        } catch (error) {
            console.log("Appwrite service :: createChallenge :: error", error);
        }
    }

    async updateChallenge(challengeID, OTP){
        try {
            return await this.account.updateMfaChallenge(challengeID, OTP);
        } catch (error) {
            console.log("Appwrite service :: updateChallenge :: error", error);
        }
    }

    async googleLogin(){
        try {
            return await this.account.createOAuth2Session(
                OAuthProvider.Google,
                'http://localhost:3000/home',
                'http://localhost:3000/login'
            );
        } catch (error) {
            console.log("Appwrite service :: googleLogin :: error", error);
        }
    }

    async githubLogin(){
        try {
            return await this.account.createOAuth2Session(
                OAuthProvider.Github,
                'http://localhost:3000/home',
                'http://localhost:3000/login'
            );
        } catch (error) {
            console.log("Appwrite service :: googleLogin :: error", error);
        }
    }

    async getCurrentUser(){
        try{
            const currentUser = await this.account.get();
            return currentUser;
        }catch(error){
            console.log("Appwrite service :: getCurrentUser :: error", error);
        }
    }

    async logout(){
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout :: error", error);        
        }
    }

    async passRec(newPass, oldPass){
        try {
            await this.account.updatePassword(newPass, oldPass);
        } catch (error) {
            console.log("Appwrite service :: passRec :: error", error);        
        }
    }

}

const authService = new AuthService();

export default authService