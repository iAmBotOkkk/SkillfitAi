
import mongoose,{Document} from "mongoose";


export interface IJob extends Document {
    title : string;
    company :string;
    location : string;
    skills : string[];
    link :string;
}


const JobSchema = new mongoose.Schema<IJob>({
        title : {type : String , required : true},
        company : String,
        location : String,
        skills : [String],
        link : String
});


const Job = mongoose.model<IJob>("Job" , JobSchema);

export default Job