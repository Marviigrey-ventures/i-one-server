import { Prop, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { AbstractDocument } from "./abstract.schema";

export class Session extends AbstractDocument {
    @Prop({ type: Types.ObjectId, ref: 'Location' })
    location: string;
    
    @Prop({ default: 0 })
    playersPerTeam: number;
    
    @Prop({ default: 0 })
    setNumber: number;
    
    @Prop({ default: 0 })
    minsPerSet: number;
    
    @Prop({ default: 0 })
    timeDuration: number;
    
    @Prop({ default: null })
    startTime: Date;
    
    @Prop({ default: null })
    stopTime: Date;
    
    @Prop({ default: null })
    winningDecider: string;
    
    @Prop({ default: false })
    inProgress: boolean;
    
    @Prop({ default: false })
    finished: boolean;
    
    @Prop({ type: Types.ObjectId, ref: 'User' })
    captain: string;
    
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
    members: string[];
    
    @Prop({ default: 0 })
    maxNumber: number;
    
    @Prop({ default: false })
    isFull: boolean;
}
export const SessionSchema = SchemaFactory.createForClass(Session);
