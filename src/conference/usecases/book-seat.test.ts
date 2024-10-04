import {InMemoryBookingRepository} from "../../conference/adapters/in-memory-booking-repository";
import {testConference} from "../../conference/tests/conference-seeds";
import {testBooking} from "../../conference/tests/booking-seeds";
import {testUser} from "../../user/tests/user-seeds";
import {BookSeat} from "../../conference/usecases/book-seat";
import {Booking} from "../../conference/entities/booking.entity";

describe('Feature book a seat', () => {

    let bookingRepository: InMemoryBookingRepository;
    let useCase: BookSeat;

    beforeEach(async () => {

        bookingRepository = new InMemoryBookingRepository();
        useCase = new BookSeat(bookingRepository);
    })

    describe('Scenario: Happy path', () => {
        const payload = {
            conferenceId: testConference.conference1.props.id,
            userId: testUser.johnDoe.props.id,
        }

        it('Should insert the booking into the database',async () => {
            await useCase.execute(payload)
            const bookings = await bookingRepository.findByConferenceId(payload.conferenceId);

            expect(bookings.length).toBe(1);
            expect(bookings[0].props.conferenceId).toBe(payload.conferenceId);
            expect(bookings[0].props.userId).toBe(payload.userId);
        })
    })

});