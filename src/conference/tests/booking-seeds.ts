import {testUser} from "../../user/tests/user-seeds";
import {testConference} from "../../conference/tests/conference-seeds";
import {Booking} from "../../conference/entities/booking.entity";

export const testBooking = {
    bobBooking: new Booking({
        userId: testUser.bob.props.id,
        conferenceId: testConference.conference1.props.id,
    }),
    aliceBooking: new Booking({
        userId: testUser.alice.props.id,
        conferenceId: testConference.conference1.props.id,
    })
}