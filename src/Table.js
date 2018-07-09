import React from 'react';
import Button from './Button';

function isSearchMatch(searchTerm) {
    return function(item) {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
  }

const Table = ( {list, pattern, onDismiss} ) => {
  
      const filteredList = list.filter(isSearchMatch(pattern));
      return (
        <div>
        {filteredList.map(item => 
          <div key={item.objectID}>
            <span>
              <a href={item.url}>{item.title} </a>
            </span>
            <span>{item.author} </span>
            <span>{item.num_comments} </span>
            <span>{item.points}</span>
            <span>
              <Button
                onClick={() => onDismiss(item.objectID)}>
              Dismiss
              </Button>
            </span>
          </div>
        )
      }
      </div>
      );
  }

  export default Table;