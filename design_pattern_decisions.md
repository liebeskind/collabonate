#Design Patterns#

-   Use of a factory vs. calling Campaign contract directly

-   Voting on requests based on total contribution rather than each address getting 1 vote

-   Storing request description and recipient address on the blockchain and not allowing alterations.

-   Use require statement to prevent contributor from voting more than once per request or from changing vote.

-   Approve / deny requests based on % of no-votes rather than yes-votes

-   If the number of no votes is ever 15%, request is denied at that moment vs. checking to see at the end of the request timeline

-   Accounts can continue to contribute during a request timeline, then vote no with more eth/wei contributed

-   Mapping of accounts that have 'voted no' against a particular request

-   Having campaign contributor finalize request vs. having funds transfer automatically at the end of 5 days

-   Using block.timestamp vs. block.number for estimating time elapsed in request

-   Emergency stop / circuit breaker
    Implements toggleContractActive function, which serves as a circuit breaker. Adds a modifier to any contract that is not already restricted (where only the campaign owner can call it). The modifier can be triggered by the owner to prevent functionality in the event of an emergency.
