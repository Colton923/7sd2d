export class SimpleXMLGenerator {
  generateItems(items: any[]): string {
    const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<items>'];
    
    for (const item of items) {
      lines.push(`  <item name="${item.name}">`);
      
      if (item.properties) {
        for (const prop of item.properties) {
          let propLine = `    <property name="${prop.name}" value="${prop.value}"`;
          if (prop.param1) propLine += ` param1="${prop.param1}"`;
          if (prop.param2) propLine += ` param2="${prop.param2}"`;
          propLine += ' />';
          lines.push(propLine);
        }
      }
      
      if (item.class_properties) {
        for (const classProp of item.class_properties) {
          lines.push(`    <property class="${classProp.class}">`);
          if (classProp.properties) {
            for (const prop of classProp.properties) {
              let propLine = `      <property name="${prop.name}" value="${prop.value}"`;
              if (prop.param1) propLine += ` param1="${prop.param1}"`;
              propLine += ' />';
              lines.push(propLine);
            }
          }
          lines.push('    </property>');
        }
      }
      
      lines.push('  </item>');
    }
    
    lines.push('</items>');
    return lines.join('\n');
  }

  generateEntities(entities: any[]): string {
    const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<entityclasses>'];
    
    for (const entity of entities) {
      let entityLine = `  <entityclass name="${entity.name}"`;
      if (entity.extends) entityLine += ` extends="${entity.extends}"`;
      entityLine += '>';
      lines.push(entityLine);
      
      if (entity.properties) {
        for (const prop of entity.properties) {
          let propLine = `    <property name="${prop.name}" value="${prop.value}"`;
          if (prop.param1) propLine += ` param1="${prop.param1}"`;
          if (prop.param2) propLine += ` param2="${prop.param2}"`;
          propLine += ' />';
          lines.push(propLine);
        }
      }
      
      if (entity.class_properties) {
        for (const classProp of entity.class_properties) {
          lines.push(`    <property class="${classProp.class}">`);
          if (classProp.properties) {
            for (const prop of classProp.properties) {
              lines.push(`      <property name="${prop.name}" value="${prop.value}" />`);
            }
          }
          lines.push('    </property>');
        }
      }
      
      if (entity.drops) {
        for (const drop of entity.drops) {
          let dropLine = `    <drop event="${drop.event}" name="${drop.name}"`;
          if (drop.count) dropLine += ` count="${drop.count}"`;
          if (drop.prob) dropLine += ` prob="${drop.prob}"`;
          if (drop.stick_chance) dropLine += ` stick_chance="${drop.stick_chance}"`;
          dropLine += ' />';
          lines.push(dropLine);
        }
      }
      
      lines.push('  </entityclass>');
    }
    
    lines.push('</entityclasses>');
    return lines.join('\n');
  }

  generateRecipes(recipes: any[]): string {
    const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<recipes>'];
    
    for (const recipe of recipes) {
      let recipeLine = `  <recipe name="${recipe.name}" count="${recipe.count || 1}"`;
      if (recipe.craft_area) recipeLine += ` craft_area="${recipe.craft_area}"`;
      if (recipe.craft_time) recipeLine += ` craft_time="${recipe.craft_time}"`;
      if (recipe.craft_exp_gain) recipeLine += ` craft_exp_gain="${recipe.craft_exp_gain}"`;
      if (recipe.tags) recipeLine += ` tags="${recipe.tags}"`;
      recipeLine += '>';
      lines.push(recipeLine);
      
      if (recipe.ingredients) {
        for (const ingredient of recipe.ingredients) {
          lines.push(`    <ingredient name="${ingredient.name}" count="${ingredient.count}" />`);
        }
      }
      
      lines.push('  </recipe>');
    }
    
    lines.push('</recipes>');
    return lines.join('\n');
  }

  generateLootContainers(containers: any[]): string {
    const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<lootcontainers>'];
    
    for (const container of containers) {
      let containerLine = `  <lootcontainer id="${container.id || container.name}" name="${container.name}"`;
      if (container.count) containerLine += ` count="${container.count}"`;
      if (container.size) containerLine += ` size="${container.size}"`;
      containerLine += '>';
      lines.push(containerLine);
      
      if (container.items) {
        for (const item of container.items) {
          let itemLine = `    <item name="${item.name}"`;
          if (item.count) itemLine += ` count="${item.count}"`;
          if (item.prob) itemLine += ` prob="${item.prob}"`;
          if (item.quality) itemLine += ` quality="${item.quality}"`;
          itemLine += ' />';
          lines.push(itemLine);
        }
      }
      
      if (container.lootgroups) {
        for (const group of container.lootgroups) {
          let groupLine = `    <lootgroup name="${group.name}"`;
          if (group.count) groupLine += ` count="${group.count}"`;
          if (group.prob) groupLine += ` prob="${group.prob}"`;
          groupLine += ' />';
          lines.push(groupLine);
        }
      }
      
      lines.push('  </lootcontainer>');
    }
    
    lines.push('</lootcontainers>');
    return lines.join('\n');
  }

  generateBlocks(blocks: any[]): string {
    const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<blocks>'];
    
    for (const block of blocks) {
      let blockLine = `  <block name="${block.name}"`;
      if (block.extends) blockLine += ` extends="${block.extends}"`;
      blockLine += '>';
      lines.push(blockLine);
      
      if (block.properties) {
        for (const prop of block.properties) {
          let propLine = `    <property name="${prop.name}" value="${prop.value}"`;
          if (prop.param1) propLine += ` param1="${prop.param1}"`;
          propLine += ' />';
          lines.push(propLine);
        }
      }
      
      if (block.drops) {
        for (const drop of block.drops) {
          let dropLine = `    <drop event="${drop.event}" name="${drop.name}"`;
          if (drop.count) dropLine += ` count="${drop.count}"`;
          if (drop.prob) dropLine += ` prob="${drop.prob}"`;
          dropLine += ' />';
          lines.push(dropLine);
        }
      }
      
      lines.push('  </block>');
    }
    
    lines.push('</blocks>');
    return lines.join('\n');
  }
}