
  

  

  <h1 class="govuk-u-heading-36">
    
      Link
    
  </h1>

  <p class="govuk-u-core-24">
    
Link component, with the following modifiers:

`--back`
Back link - a black underlined link with a left pointing arrow. To sit at the top left of a page

`--muted`
Muted link - used for is "anything wrong with this page?" links

`--download`
Download Link - with download icon

`--skip`
Skiplink - skip to the main page content

  </p>

  <p class="govuk-u-copy-19">
    <a href="
  http://www.linktodesignsystem.com
">
      Find link guidance on the GOV.UK Design System.
    </a>
  </p>

  <h2 class="govuk-u-heading-24">How this component looks</h2>
  <div>
    
      


  <a href="" class="govuk-c-link govuk-c-link--back">Back</a>




  <a href="" class="govuk-c-link govuk-c-link--muted">Is there anything wrong with this page?</a>




  <a href="" class="govuk-c-link govuk-c-link--download"></a>




  <a href="" class="govuk-c-link govuk-c-link--skip">Skip to main content</a>



    
  </div>

  <p class="govuk-u-copy-19">
    
    <a href=" http://govuk-frontend-review.herokuapp.com/components/undefined/preview">
      Preview the link component.
    </a>
  </p>

  <h2 class="govuk-u-heading-24">How to call this component</h2>
  <pre><code></code></pre>

  
    <h2 class="govuk-u-heading-24">Component arguments</h2>
    <div>
      
<!-- TODO: Use the table macro here and pass it component argument data -->
| Name      | Type    | Default | Required  | Description
|---        |---      |---      |---        |---
| linkHref  | string  |         | Yes       | The value of the link href attribute
| linkText  | string  |         | Yes       | The link text
| classes   | string  |         | Yes       | The modifier required for the link type
                                            | --back
                                            | --muted
                                            | --download
                                            | --skip

    </div>
  

  <h2 class="govuk-u-heading-24">Component HTML</h2>
  <pre><code></code></pre>

  
  <h2 class="govuk-u-heading-24">Installation</h2>
  <pre>
    <code>
      npm install --save @govuk-frontend/link
    </code>
  </pre>
  



