Feature: Employees

  Scenario: Browse the full employee list
    Given I am on the employees page
    Then the employees table should be visible
    And at least one employee row should be displayed
    And the results header should show the total count

  Scenario: Filter employees by first name
    Given I am on the employees page
    When I filter employees by first name "a"
    Then the employees table should be visible
    And at least one employee row should be displayed
    And each visible employee row should contain "a" in the name column
