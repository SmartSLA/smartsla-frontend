## SmartSLA [1.6.6]

**The 1.6.6 release of SmartSLA is out**

- **smartsla-frontend** : 1.6.6 - [changelog](https://github.com/SmartSLA/smartsla-frontend/compare/1.6.4...1.6.6)

https://ci.linagora.com/linagora/lgs/smartsla/smartsla-frontend/-/compare/1.6.4...master?from_project_id=1718

- **smartsla-backend** : 1.6.6 - [changelog](https://github.com/SmartSLA/smartsla-backend/compare/1.6.4...1.6.6)

#### Breaking changes:

  * No Breaking changes.

#### Main features:

  * **Optimization chunks spliting**
    SmartSLA now support static gzip and chunks splitting to have an application faster displayed than before.

  * **LINFOSEC : improve software vulnerability display**
    To a better explication of software vulnerabilities, we :
    * added the impact score (Base score)
    * added the NVD CVE link
    * fixed Version start and version end of affected versions
    * fixed title translation

  * **Support SSP reset link**
    We are now able to redirect the user, in the login page and in the creation mail directly to the reset password page done by our SSP.

  * **Add dynamic page title**
    We've done a big work by adding each page title to a better UI

  * **New Login page**
    We've improved the UX of the login page 

  * **Add multiselection**
    Users are now able to do multiselection in additionnal filters to filter faster than before requests.

  * **Mention participants**
    Mentions are a direct way to notify people of something that requires their attention in the request.
    When commenting a request, the user can now enter the @ symbol. Enter a name or select one from the list of users. You can repeat this step for every user that you’d like to mention in your message.

  * **Update a comment**
     Users are now able to update a comment, when they want to correct the comment or add attachments
    On clicking on the three dots, the user can now update a comment. The comment section will be displayed to the user, he can update the comment or attachments but not the status or the assigned. Modifications are archived and a history of modifications are displayed with the writer and the date.
    Admin can update each comments.

  * **Delete a comment**
    Users are now able to delete a comment, when they want to correct the comment
    On clicking on the three dots, the user can now delete a comment. Enter a reason for deleting this comment will be asked. The reason will be display to describe deleted this comment to others. The user can also undo the delete.
    Admin can delete each comments 


#### Bug fixes and improvements

  * Smartsla-frontend:
    * #885 Add optimization chunks spliting
    * #918 show Internal mailing list only for admin
    * #908 Add vulnerability to dashboard widgets
    * #909 Improve supported software in contract page detail
    * #906 add getSoftwareTitle function
    * #737 Prevent editing profile
    * #916 Add contract link
    * #911 Improve related issues
    * #906 improve software vulnerability display
    * #853 Add dynamic page title
    * #907 keep primary color only in selected item
    * #835 Add software link
    * #807 Add tooltip
    * #756 Change widget label display by month
    * #748 Fix fr translation
    * #905 Prevent empty or invalid email address
    * #901 improve image and code display in comment
    * #895 Impove message in requests list
    * #900 add a reset ssp link
    * #887 Add multiselection filter
    * #882 Add and replace author by beneficiary
    * #899 Update user phone
    * #898 improve login page
    * #894 display when ticket is suspended
    * #830 Add client info
    * #875 Add additional filter ux improvement
    * #886 Fix referent user link
    * #890 Mention participants in vue-editor
    * #829 Fix error attachment
    * #829 Edit event attachment
    * #884 fix additional filter objects of Vuetify components
    * #891 fix breadcrumb translation
    * #892 Display status and comment section for a software vulerability
    * #886 Fix mailto technical referent
    * #886 Improve technical referent list
    * #873 Fix func call error
    * #873 Revert comment deletion
    * #829 Change event history key
    * #829 Update comment
    * #873 Delete a comment
    * #884 fix all table objects display of Vuetify components
    * #883 improve sending comment message
    * #861 reset requests in the filter drawer
    * #880 remove assignedto if empty
    * #881 fix all element displayed in data tables
    * #878 fix requests columns,translate and service deadlines display in the request list
    * #856 Trigger update widget filters
    * #878 fix organization label and add expired label to contract link


  * Smartsla-backend:
    * smartsla-frontend#897 Finalize new HTML email templating
    * smartsla-frontend#900 add a reset ssp link
    * smartsla-frontend#908 Add vulnerability type
    * Update esn to 1.6.6 esn#3063 Update deprecated bower library
    * Update esn to 1.6.5 esn#2923 Ldap connection leaks
    * smartsla-frontend#906 improve software vulnerability display
    * smartsla-frontend#829 Send email to mentioned user
    * smartsla-frontend#902 Do not show limesurvey url if no survey
    * smartsla-frontend#902 Fix attachments translation
    * smartsla-frontend#899 Add user phone
    * smartsla-frontend#830 show contract manager
    * smartsla-frontend#893 Fix unit tests
    * smartsla-frontend#893 Add survey section to update html template
    * smartsla-frontend#890 Add participants mentions
    * smartsla-frontend#829 edit attachments
    * smartsla-frontend#892 Display software vulnerability  in open tickets
    * smartsla-frontend#886 Change technicalReferent type in contract  schema
    * smartsla-frontend#873 Fix linter errors
    * smartsla-frontend#873 Revert comment deletion
    * smartsla-frontend#829 Update comment
    * smartsla-frontend#873 Delete comment
    * Adding logger in Filter API
    * smartsla-frontend#861 remove vulnerability software type to open filter
    * smartsla-frontend#849 update private email notification
    * smartsla-frontend#861 fix user filters
