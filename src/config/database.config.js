import mongoose from "mongoose";


export const dbConnect=()=>{
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
        .then(() => {
          console.log('MongoDB connected');
        })
        .catch((err) => {
          console.error(err);
        });
}