import mongoose from "mongoose";

// import Inc from "mongoose-sequence";
// const AutoIncrement = Inc(mongoose);


const noteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        },
        ticket_num: {
            type: Number
        },
    },
    {
        timestamps: true
    }
)

// not working creating note stuck when using counter
// TODO: create a counter for ticket number
// noteSchema.plugin(AutoIncrement, {
//     inc_field: 'ticket',
//     id: 'ticketNums',
//     start_seq: 500
// })

const Note = mongoose.model('Note', noteSchema);

export default Note;