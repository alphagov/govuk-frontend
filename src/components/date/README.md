


<h1 class="govuk-u-heading-36">
Date
</h1>

<p class="govuk-u-core-24">
  Date description.
</p>

<p class="govuk-u-copy-19">
  <a href="http://www.linktodesignsystem.com/date">Find date guidance on the GOV.UK Design System.</a>
</p>


<p class="govuk-u-copy-19">
<a href="http://govuk-frontend-review.herokuapp.com/components/date/preview">Preview the date component.
</a>
</p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>

  <pre><code></code></pre>

<h2 class="govuk-u-heading-24">Component arguments</h2>

<div>

  <!-- TODO: Use the table macro here and pass it component argument data -->

</div>

<h2 class="govuk-u-heading-24">Component HTML</h2>
<pre><code>&lt;div class=&quot;govuk-c-date&quot;&gt;
  &lt;div class=&quot;govuk-c-date__item govuk-c-date__item--day&quot;&gt;
    &lt;label class=&quot;govuk-c-label govuk-c-date__label&quot; for=&quot;dob-day&quot;&gt;Day&lt;/label&gt;
    &lt;input class=&quot;govuk-c-input govuk-c-date__input&quot; id=&quot;dob-day&quot; name=&quot;dob-day&quot; type=&quot;number&quot;&gt;
  &lt;/div&gt;
  &lt;div class=&quot;govuk-c-date__item govuk-c-date__item--month&quot;&gt;
    &lt;label class=&quot;govuk-c-label govuk-c-date__label&quot; for=&quot;dob-month&quot;&gt;Month&lt;/label&gt;
    &lt;input class=&quot;govuk-c-input govuk-c-date__input&quot; id=&quot;dob-month&quot; name=&quot;dob-month&quot; type=&quot;number&quot;&gt;
  &lt;/div&gt;
  &lt;div class=&quot;govuk-c-date__item govuk-c-date__item--year&quot;&gt;
    &lt;label class=&quot;govuk-c-label govuk-c-date__label&quot; for=&quot;dob-year&quot;&gt;Year&lt;/label&gt;
    &lt;input class=&quot;govuk-c-input govuk-c-date__input&quot; id=&quot;dob-year&quot; name=&quot;dob-year&quot; type=&quot;number&quot;&gt;
  &lt;/div&gt;
&lt;/div&gt;

&lt;legend&gt;
  &lt;span class=&quot;govuk-c-error-message&quot;&gt;Error message goes here&lt;/span&gt;
&lt;/legend&gt;
&lt;div class=&quot;govuk-c-date&quot;&gt;
  &lt;div class=&quot;govuk-c-date__item govuk-c-date__item--day&quot;&gt;
    &lt;label class=&quot;govuk-c-label govuk-c-date__label&quot; for=&quot;dob-day-1&quot;&gt;Day&lt;/label&gt;
    &lt;input class=&quot;govuk-c-input govuk-c-date__input govuk-c-input--error&quot; id=&quot;dob-day-1&quot; name=&quot;dob-day&quot; type=&quot;number&quot;&gt;
  &lt;/div&gt;
  &lt;div class=&quot;govuk-c-date__item govuk-c-date__item--month&quot;&gt;
    &lt;label class=&quot;govuk-c-label govuk-c-date__label&quot; for=&quot;dob-month-1&quot;&gt;Month&lt;/label&gt;
    &lt;input class=&quot;govuk-c-input govuk-c-date__input&quot; id=&quot;dob-month-1&quot; name=&quot;dob-month&quot; type=&quot;number&quot;&gt;
  &lt;/div&gt;
  &lt;div class=&quot;govuk-c-date__item govuk-c-date__item--year&quot;&gt;
    &lt;label class=&quot;govuk-c-label govuk-c-date__label&quot; for=&quot;dob-year-1&quot;&gt;Year&lt;/label&gt;
    &lt;input class=&quot;govuk-c-input govuk-c-date__input&quot; id=&quot;dob-year-1&quot; name=&quot;dob-year&quot; type=&quot;number&quot;&gt;
  &lt;/div&gt;
&lt;/div&gt;
</code></pre>

<h2 class="govuk-u-heading-24">Installation</h2>
<pre><code>npm install --save @govuk-frontend/date</code></pre>

