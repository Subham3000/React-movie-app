import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // 1. use appwrite to check if the search term exists in the database or not
    try {

        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.equal('searchTerm',searchTerm),
        ])

        // 2. if the searchTerm exits then update the count
        if (result.documents.length > 0) {
            const doc = result.documents[0];

            await database.updateDocument(DATABASE_ID,COLLECTION_ID,doc.$id,{
                count: doc.count + 1,
            })
        }
        // 3. else if it does not exsits create a new one with count 1
        else{
            await database.createDocument(DATABASE_ID,COLLECTION_ID, ID.unique(),{
                searchTerm,
                count: 1,
                poster: `https://wsrv.nl/?url=https://simkl.in/posters/${movie.poster}_m.jpg`,
                movie_id: movie.ids['simkl_id']
            })
        }
        
    } catch (error) {
        console.log(error);
    }

}


export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID,[
            Query.limit(5),
            Query.orderDesc('count')
        ]);

        return result.documents;
    } catch (error) {
        console.log(error);
    }
}