
import mongoose,{Document} from "mongoose";


export interface IJob extends Document {
    title : string;
    company :string;
    location : string;
    salary:string;
    skills : string[];
    requirements : string[]
    apply_link :string;
}


const JobSchema = new mongoose.Schema<IJob>({
        title : {type : String , required : true},
        company : String,
        location : String,
        salary:{type: String},
        skills : [String],
        requirements: { type: [String], required: true },
        apply_link : String
});


const Job = mongoose.model<IJob>("Job" , JobSchema);

export default Job