
  

  

  <h1 class="govuk-u-heading-36">
    
      Label
    
  </h1>

  <p class="govuk-u-core-24">
    
  Use labels for all form fields.

  </p>

  <p class="govuk-u-copy-19">
    <a href="
  http://www.linktodesignsystem.com
">
      Find label guidance on the GOV.UK Design System.
    </a>
  </p>

  <h2 class="govuk-u-heading-24">How this component looks</h2>
  <div>
    
      


  

<label class="govuk-c-label " for="">
  National Insurance number

  
    <span class="govuk-c-label__hint">It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.</span>
  

  
</label>




  

<label class="govuk-c-label  govuk-c-label--bold " for="">
  National Insurance number

  
    <span class="govuk-c-label__hint">It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.</span>
  

  
</label>




  

<label class="govuk-c-label " for="">
  National Insurance number

  
    <span class="govuk-c-label__hint">It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.</span>
  

  
    
  <span class="govuk-c-error-message ">
  Error message goes here
</span>


  
</label>



    
  </div>

  <p class="govuk-u-copy-19">
    
    <a href=" http://govuk-frontend-review.herokuapp.com/components/undefined/preview">
      Preview the label component.
    </a>
  </p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>
  <pre><code></code></pre>

  
    <h2 class="govuk-u-heading-24">Component arguments</h2>
    <div>
      
<!-- TODO: Use the table macro here and pass it component argument data -->
| Name          | Type    | Required  | Description
|---            |---      |---        |---
| classes       | string  | No        | Optional additional classes
| labelText     | string  | Yes       | The label text
| hintText      | string  | No        | Optional hint text
| errorMessage  | string  | No        | Optional error message
| id            | string  | Yes       | The value of the for attribute, the id input the label is associated with

    </div>
  

  <h2 class="govuk-u-heading-24">Component HTML</h2>
  <pre><code></code></pre>

  
  <h2 class="govuk-u-heading-24">Installation</h2>
  <pre>
    <code>
      npm install --save @govuk-frontend/label
    </code>
  </pre>
  



