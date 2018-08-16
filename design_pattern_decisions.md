#Design Patterns#

-   Voting on requests based on total contribution rather than each address getting 1 vote

-   Storing request description and recipient address on the blockchain and not allowing alterations.

-   Taking snapshot of contributors and totalContributions when request is made

-   Storing contributorsSnapshot as a mapping, which can't be looped through. Prevents address from voting 'no' more than once per request

-   Approve / deny requests based on % of no-votes rather than yes-votes

-   Mapping of accounts that have voted no against a particular request

-   Emergency stop
