import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';

const CardSection = ({ 
  title, 
  children, 
  collapsible = false, 
  initiallyCollapsed = false,
  titleColor = '#333'
}) => {
  const [collapsed, setCollapsed] = useState(initiallyCollapsed);
  
  const toggleCollapse = () => {
    if (collapsible) {
      setCollapsed(!collapsed);
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header}
        onPress={toggleCollapse}
        disabled={!collapsible}
      >
        <Text style={[styles.title, { color: titleColor }]}>
          {title}
        </Text>
        
        {collapsible && (
          <Text style={styles.collapseIcon}>
            {collapsed ? '▼' : '▲'}
          </Text>
        )}
      </TouchableOpacity>
      
      {!collapsed && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  collapseIcon: {
    fontSize: 12,
    color: '#666',
  },
  content: {
    padding: 15,
  },
});

export default CardSection;