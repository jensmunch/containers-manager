import React, { Component } from 'react';
import { DataTable, TableBody, TableRow, TableColumn, FontIcon } from 'react-md';
import './styles.css';

class ContainerDocuments extends Component {
  getDocumentIcon = doc => {
    switch (doc.contentType) {
      case 'application/pdf':
        return 'pdf';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/x-iwork-pages-sffpages':
        return 'doc';
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/x-iwork-keynote-sffnumbers':
        return 'excel';
      default:
        return 'img';
    }
  };

  render() {
    const { container } = this.props;

    return (
      <div className="documentsWrapper">
        <DataTable plain>
          <TableBody>
            {container.documents.map(doc => (
              <TableRow key={doc.name}>
                <TableColumn>
                  <a
                    className={`icon ${this.getDocumentIcon(doc)}`}
                    href={doc.downloadURL}
                    target="_blank"
                  >
                    {doc.name}
                  </a>
                </TableColumn>
                <TableColumn className="md-text-right">
                  {doc.hashMatch && doc.sizeMatch ? (
                    <FontIcon secondary>done</FontIcon>
                  ) : (
                    <FontIcon error>block</FontIcon>
                  )}
                </TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </div>
    );
  }
}

export default ContainerDocuments;
