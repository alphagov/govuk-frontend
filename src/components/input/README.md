
  

  

  <h1 class="govuk-u-heading-36">
    
      Input
    
  </h1>

  <p class="govuk-u-core-24">
    
  A single-line text field.

  </p>

  <p class="govuk-u-copy-19">
    <a href="
  http://www.linktodesignsystem.com
">
      Find input guidance on the GOV.UK Design System.
    </a>
  </p>

  <h2 class="govuk-u-heading-24">How this component looks</h2>
  <div>
    
      


  


  

<label class="govuk-c-label " for="input-1">
  National Insurance number

  

  
</label>



<input class="govuk-c-input " id="input-1" name="test-name" type="text" >




  


  

<label class="govuk-c-label " for="input-2">
  National Insurance number

  
    <span class="govuk-c-label__hint">It’s on your National Insurance card, benefit letter, payslip or P60. For example, ‘QQ 12 34 56 C’.</span>
  

  
</label>



<input class="govuk-c-input " id="input-2" name="test-name-2" type="text" >




  


  

<label class="govuk-c-label " for="input-3">
  National Insurance number

  
    <span class="govuk-c-label__hint">It’s on your National Insurance card, benefit letter, payslip or P60.
    For example, ‘QQ 12 34 56 C’.</span>
  

  
    
  <span class="govuk-c-error-message ">
  Error message goes here
</span>


  
</label>



<input class="govuk-c-input govuk-c-input--error" id="input-3" name="test-name-3" type="text" >



    
  </div>

  <p class="govuk-u-copy-19">
    
    <a href=" http://govuk-frontend-review.herokuapp.com/components/undefined/preview">
      Preview the input component.
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
| id            | string  | Yes       | The id of the input
| name          | string  | Yes       | The name of the input, which is submitted with the form data.
| value         | string  | No        | Optional initial value of the input

    </div>
  

  <h2 class="govuk-u-heading-24">Component HTML</h2>
  <pre><code></code></pre>

  
  <h2 class="govuk-u-heading-24">Installation</h2>
  <pre>
    <code>
      npm install --save @govuk-frontend/input
    </code>
  </pre>
  



