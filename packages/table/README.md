# Table

A component for tabular data.

## Guidance

Guidance and documentation can be found on [GOV.UK Design system](linkgoeshere).

## Demo

Table [demo](http://govuk-frontend.herokuapp.com/components/table/index.html).

## Usage

Code example(s)

```
<table class="govuk-c-table">
  <thead class="govuk-c-table__head">
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="col">Month you apply</th>
      <th class="govuk-c-table__header govuk-c-table__header--numeric" scope="col">Rate for vehicles</th>
      <th class="govuk-c-table__header govuk-c-table__header--numeric" scope="col">Rate for bicycles</th>
    </tr>
  </thead>
  <tbody class="govuk-c-table__body">
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row">January</th>
      <td class="govuk-c-table__cell govuk-c-table__cell--numeric">£165.00</td>
      <td class="govuk-c-table__cell govuk-c-table__cell--numeric">£85.00</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row">February</th>
      <td class="govuk-c-table__cell govuk-c-table__cell--numeric">£165.00</td>
      <td class="govuk-c-table__cell govuk-c-table__cell--numeric">£85.00</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row">March</th>
      <td class="govuk-c-table__cell govuk-c-table__cell--numeric">£151.25</td>
      <td class="govuk-c-table__cell govuk-c-table__cell--numeric">£77.90</td>
    </tr>
    <tr class="govuk-c-table__row">
      <th class="govuk-c-table__header" scope="row">April</th>
      <td class="govuk-c-table__cell govuk-c-table__cell--numeric">£136.10</td>
      <td class="govuk-c-table__cell govuk-c-table__cell--numeric">£70.10</td>
    </tr>
  </tbody>
</table>

<table class="govuk-c-table">
  <caption class="govuk-c-table__caption heading-small">Dates and amounts</caption>
  <tbody class="govuk-c-table__body">
    <tr class="govuk-c-table__row">
      <td class="govuk-c-table__cell">First 6 weeks</td>
      <td class="govuk-c-table__cell">£109.80 per week</td>
    </tr>
    <tr class="govuk-c-table__row">
      <td class="govuk-c-table__cell">Next 33 weeks</td>
      <td class="govuk-c-table__cell">£109.80 per week</td>
    </tr>
    <tr class="govuk-c-table__row">
      <td class="govuk-c-table__cell">Total estimated pay</td>
      <td class="govuk-c-table__cell">£4,282.20</td>
    </tr>
    <tr class="govuk-c-table__row">
      <td class="govuk-c-table__cell">Tell the mother’s employer</td>
      <td class="govuk-c-table__cell">28 days before they want to start maternity pay</td>
    </tr>
  </tbody>
</table>

```



## Installation

```
npm install --save @govuk-frontend/table
```

