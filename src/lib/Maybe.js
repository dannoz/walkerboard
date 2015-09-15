/**
 *  Maybe's are used extensively instead of direct values.
 *  They represent the possibility of a value.
 *  They are immutable and have three possible states:
 *      1. pending - the data for this is loading/generating or otherwise in-progress
 *      2. error - the process to get this data failed.
 *      3. ok - we have the value
 *
 *  the last 2 states have an associated value, the error for error state and the value for the
 *  ok state. To make it easy for react rendering, they have a nice method called "when", which takes
 *  an object of functions and an calls the correct one based on the state.
 */
const
    PENDING = 0,
    ERROR = 1,
    OK = 2;

const noop = () => {};

const getState = (value) => {
    switch (true) {
    case value === undefined:
        return PENDING;
    case value instanceof Error:
        return ERROR;
    default:
        return OK;
    }
};

export default function Maybe(dataOrError) {
    const state = getState(dataOrError);
    const when = ({ pending, error, ok }) => {
        //ensure they are all functions
        [pending, error, ok] = [pending, error, ok].map((fn) => typeof fn !== "function" ? noop : fn);
        return state === PENDING ? pending() : (state === ERROR ? error : ok)(dataOrError);
    };
    return Object.create(Maybe.prototype, { //use the Maybe.prototype, so "instanceof" works as expected
        isPending: {
            enumerable: true,
            value: state === PENDING
        },
        isError: {
            enumerable: true,
            value: state === ERROR
        },
        isOK: {
            enumerable: true,
            value: state === OK
        },
        value: {
            enumerable: true,
            value: dataOrError
        },
        when: {
            value: when
        }
    });
}
