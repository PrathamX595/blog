import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    bucket;
    database;

    constructor(){
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjID);
        this.database = new Databases(this.client);
        this.bucket = new Storage(this.client);

    }

    async createPost({userID, title, content, slug, featuredImg, status}){
        try {
            return await this.database.createDocument(config.appwriteDatabaseID, config.appwriteCollectionID, slug, {
                userID,
                title,
                content,
                featuredImg,
                status,
                slug
            });
        } catch (error) {
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, featuredImg, status}){
        try {
            return await this.database.updateDocument(config.appwriteDatabaseID, config.appwriteCollectionID, slug, {
                title,
                content,
                featuredImg,
                status
            });
        } catch (error) {
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    async deletePost(slug){
        try {
            await this.database.deleteDocument(config.appwriteDatabaseID, config.appwriteCollectionID, slug);
            return true
        } catch (error) {
            console.log("Appwrite service :: deletePost :: error", error);
            return false
        }
    }

    async getPost(slug){
        try {
            return await this.database.getDocument(config.appwriteDatabaseID, config.appwriteCollectionID, slug);
        } catch (error) {
            console.log("Appwrite service :: getPost :: error", error);
            return false
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]){
        try {
            return await this.database.listDocuments(config.appwriteDatabaseID, config.appwriteCollectionID, queries);
        } catch (error) {
            console.log("Appwrite service :: getPosts :: error", error);
            return false
        }
    }

    //file services
    async uploadFile(file){
        try {
            return await this.bucket.createFile(config.appwriteBucketID, ID.unique(), file);
        } catch (error) {
            console.log("Appwrite service :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileID){
        try {
            await this.bucket.deleteFile(config.appwriteBucketID, fileID);
            return true
        } catch (error) {
            console.log("Appwrite service :: deleteFile :: error", error);
            return false
        }
    }

    filePreview(fileID){
        return this.bucket.getFilePreview(config.appwriteBucketID, fileID);
    }
}

const service = new Service
export default service