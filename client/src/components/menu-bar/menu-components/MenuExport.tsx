import React from 'react';
import { withTranslation } from 'react-i18next';
import { capitalize, uniqueId } from 'lodash';
import { saveAs } from 'file-saver';
import MenuComponent from './MenuComponent';
<<<<<<< HEAD
//import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
//import ReactPDF from '@react-pdf/renderer';
=======
import { Dropdown } from 'react-bootstrap';
>>>>>>> dev

class MenuExport extends MenuComponent {
  constructor(props: any, key?: string) {
    super(props, uniqueId('menu/export-'), key);
  }

  render = () => {
    const { t, i18n, tReady, className, label, getExportedFile, ...rest } =
      this.props;

    return (
      <Dropdown.Item
        as="button"
        className={`small dropdown-item ${className ? className : ''}`}
        onClick={() => {
          const file: File = getExportedFile();
          saveAs(file, file.name);
        }}
        key={this.key}
        {...rest}
      >
        {capitalize(t(label || 'export item'))}
      </Dropdown.Item>
    );
  };
}

export default withTranslation()(MenuExport);

// // Create styles
// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'row',
//     backgroundColor: '#E4E4E4'
//   },
//   section: {
//     margin: 10,
//     padding: 10,
//     flexGrow: 1
//   }
// });

// // Create Document Component
// const MyDocument = () => (
//   <Document>
//     <Page size="Letter" style={styles.page}>
//       <View style={styles.section}>
//         <Text>Section #1</Text>
//       </View>
//       <View style={styles.section}>
//         <Text>Section #2</Text>
//       </View>
//     </Page>
//   </Document>
// );

// ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);


// SAVE TXT FILE:

// import React, { useEffect, useState } from 'react'

// export const SaveList: React.FC = ({list}) => {
//   // set up local state for generating the download link
//   const [downloadLink, setDownloadLink] = useState('')

//   // function for generating file and set download link
//   const makeTextFile = () => {
//     // This creates the file. 
//     // In my case, I have an array, and each item in 
//     // the array should be on a new line, which is why
//     // I use .join('\n') here.
//     const data = new Blob([list.join('\n')], { type: 'text/plain' })

//     // this part avoids memory leaks
//     if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink)

//     // update the download link state
//     setDownloadLink(window.URL.createObjectURL(data))
//   }

//   // Call the function if list changes
//   useEffect(() => {
//     makeTextFile()
//   }, [list])

//   return (
//     <a
//       // this attribute sets the filename
//       download='list.txt'
//       // link to the download URL
//       href={downloadLink}
//     >
//       download
//     </a>
//   )
// }

// export default SaveList



