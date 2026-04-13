Feature: Companies

  Scenario: Browse company list and navigate to company details
    Given I am on the companies page
    Then the companies table should be visible
    And at least one company row should be displayed

    When I click on the first company link
    Then I should be on the company detail page
    And the company name heading should be visible
    And the back link should be visible

  Scenario: Filter companies by name then navigate to detail
    Given I am on the companies page
    When I filter companies by name "a"
    Then the companies table should be visible
    And at least one company row should be displayed

    When I click on the first company link
    Then I should be on the company detail page
    And the departments section should be visible
