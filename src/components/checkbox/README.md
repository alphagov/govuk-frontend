
  

  

  <h1 class="govuk-u-heading-36">
    
      Checkbox
    
  </h1>

  <p class="govuk-u-core-24">
    
  Breadcrumb navigation, showing page hierarchy.

  </p>

  <p class="govuk-u-copy-19">
    <a href="
  http://www.linktodesignsystem.com
">
      Find checkbox guidance on the GOV.UK Design System.
    </a>
  </p>

  <h2 class="govuk-u-heading-24">How this component looks</h2>
  <div>
    
      


  
  <div class="govuk-c-checkbox ">
    <input class="govuk-c-checkbox__input" id="waste-type-1" name="waste-types" type="checkbox" value="waste-animal"   >
    <label class="govuk-c-checkbox__label" for="waste-type-1">Waste from animal carcasses</label>
  </div>

  <div class="govuk-c-checkbox ">
    <input class="govuk-c-checkbox__input" id="waste-type-2" name="waste-types" type="checkbox" value="waste-mines"   >
    <label class="govuk-c-checkbox__label" for="waste-type-2">Waste from mines or quarries</label>
  </div>

  <div class="govuk-c-checkbox ">
    <input class="govuk-c-checkbox__input" id="waste-type-3" name="waste-types" type="checkbox" value="waste-farm"  checked >
    <label class="govuk-c-checkbox__label" for="waste-type-3">Farm or agricultural waste</label>
  </div>

  <div class="govuk-c-checkbox ">
    <input class="govuk-c-checkbox__input" id="waste-type-4" name="waste-types" type="checkbox" value="waste-disabled"   disabled>
    <label class="govuk-c-checkbox__label" for="waste-type-4">Disabled checkbox option</label>
  </div>




    
  </div>

  <p class="govuk-u-copy-19">
    
    <a href=" http://govuk-frontend-review.herokuapp.com/components/undefined/preview">
      Preview the checkbox component.
    </a>
  </p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>
  <pre><code></code></pre>

  
    <h2 class="govuk-u-heading-24">Component arguments</h2>
    <div>
      

<!-- TODO: Use the table macro here and pass it component argument data -->

| Name        | Type    | Default | Required | Description
|---          |---      |---      |---       |---
| classes     | string  |         | No       | Optional additional classes
| name        | string  |         | Yes      | Name of the group of checkboxes
| id          | string  |         | Yes      | ID is prefixed to the ID of each checkbox
| checkboxes  | array   |         | Yes      | Checkboxes array with id, value, label, checked and disabled keys


    </div>
  

  <h2 class="govuk-u-heading-24">Component HTML</h2>
  <pre><code></code></pre>

  
  <h2 class="govuk-u-heading-24">Installation</h2>
  <pre>
    <code>
      npm install --save @govuk-frontend/checkbox
    </code>
  </pre>
  



