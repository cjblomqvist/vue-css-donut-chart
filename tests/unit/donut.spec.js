import { shallowMount, mount } from '@vue/test-utils';
import colors from '../../src/utils/colors';
import { placementStyles } from '../../src/utils/misc';
import { el, hextToCssRgb, triggerResize } from '../utils';
import Donut from '../../src/components/Donut.vue';

describe('Donut component', () => {
  describe('"size" prop', () => {
    it('renders the donut with 250px height and width when the size isn\'t specified', () => {
      const wrapper = shallowMount(Donut);
      const { style: donutStyles } = wrapper.find(el.DONUT).element;

      expect(donutStyles.width).toBe('250px');
      expect(donutStyles.paddingBottom).toBe('250px');
    });

    it('renders the donut with proper height and width based on the size prop', () => {
      const size = 200;
      const sizeWithUnit = `${size}px`;

      const wrapper = shallowMount(Donut, { propsData: { size } });
      const { style: donutStyles } = wrapper.find(el.DONUT).element;

      expect(donutStyles.width).toBe(sizeWithUnit);
      expect(donutStyles.paddingBottom).toBe(sizeWithUnit);
    });
  });

  describe('"unit" prop', () => {
    it('defaults to px unit for the donut size when the unit isn\'t specified', () => {
      const defaultUnit = 'px';

      const wrapper = shallowMount(Donut);
      const { style: donutStyles } = wrapper.find(el.DONUT).element;

      expect(donutStyles.width.endsWith(defaultUnit)).toBe(true);
      expect(donutStyles.paddingBottom.endsWith(defaultUnit)).toBe(true);
    });

    it('respects the unit provided via unit prop for donut size', () => {
      const [size, unit] = [50, '%'];

      const wrapper = shallowMount(Donut, { propsData: { size, unit } });
      const { style: donutStyles } = wrapper.find(el.DONUT).element;

      expect(donutStyles.width.endsWith(unit)).toBe(true);
      expect(donutStyles.paddingBottom.endsWith(unit)).toBe(true);
    });
  });

  describe('"thickness" prop', () => {
    it('renders the donut with 20% ring thickness when the thickness isn\'t specified', () => {
      const defaultThickness = 20;

      const wrapper = shallowMount(Donut);
      const { style: donutStyles } = wrapper.find(el.DONUT_OVERLAY).element;

      const expectedDonutOverlaySize = `${100 - defaultThickness}%`;
      expect(donutStyles.width).toBe(expectedDonutOverlaySize);
      expect(donutStyles.height).toBe(expectedDonutOverlaySize);
    });

    it('renders the donut with correct ring thickness based on the thickness prop', () => {
      const thickness = 30;

      const wrapper = shallowMount(Donut, { propsData: { thickness } });
      const { style: donutStyles } = wrapper.find(el.DONUT_OVERLAY).element;

      const expectedDonutOverlaySize = `${100 - thickness}%`;
      expect(donutStyles.width).toBe(expectedDonutOverlaySize);
      expect(donutStyles.height).toBe(expectedDonutOverlaySize);
    });
  });

  describe('"text" prop and default slot', () => {
    it('renders the text provided via text prop in the center of the donut', () => {
      const text = 'An example text.';

      const wrapper = shallowMount(Donut, { propsData: { text } });
      const overlay = wrapper.find(el.DONUT_OVERLAY);

      expect(overlay.text()).toBe(text);
    });

    it('renders the content provided via default slot in the center of the donut', () => {
      const html = '<p><strong>An</strong> example text.</p>';

      const wrapper = shallowMount(Donut, {
        slots: { default: html }
      });
      const overlayEl = wrapper.find(el.DONUT_OVERLAY_CONTENT).element;

      expect(overlayEl.innerHTML).toBe(html);
    });
  });

  describe('"background" and "foreground" props', () => {
    it('renders the donut with default background and foreground colors when they\'re not specified', () => {
      const [defaultForegroundColor, defaultBackgroundColor] = ['#eeeeee', '#ffffff'];

      const wrapper = shallowMount(Donut);
      const donut = wrapper.find(el.DONUT).element;
      const donutOverlay = wrapper.find(el.DONUT_OVERLAY).element;

      expect(donut.style.backgroundColor).toBe(hextToCssRgb(defaultForegroundColor));
      expect(donutOverlay.style.backgroundColor).toBe(hextToCssRgb(defaultBackgroundColor));
    });

    it('renders the donut with specified background and foreground colors', () => {
      const [foreground, background] = ['#abcdef', '#fedcba'];

      const wrapper = shallowMount(Donut, { propsData: { foreground, background } });
      const donut = wrapper.find(el.DONUT).element;
      const donutOverlay = wrapper.find(el.DONUT_OVERLAY).element;

      expect(donut.style.backgroundColor).toBe(hextToCssRgb(foreground));
      expect(donutOverlay.style.backgroundColor).toBe(hextToCssRgb(background));
    });
  });

  describe('"sections" prop', () => {
    it('renders the proper number of sections based on the section prop', () => {
      let sections = [
        { value: 25 },
        { value: 25 },
        { value: 25 },
        { value: 25 }
      ];

      const wrapper = mount(Donut, { propsData: { sections } });

      let sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      expect(sectionWrappers).toHaveLength(sections.length);


      sections = [
        { value: 20 },
        { value: 20 }
      ];
      wrapper.setProps({ sections });

      sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      expect(sectionWrappers).toHaveLength(sections.length);

      sections = [
        { value: 60 },
        { value: 20 }
      ];
      wrapper.setProps({ sections });

      sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      // since one section takes up more than 180 degrees, it should be split into 2
      expect(sectionWrappers).toHaveLength(sections.length + 1);
    });

    // eslint-disable-next-line max-len
    it('renders the sections with correct colors and plugs in default colors if one isn\'t specified with the "color" property', () => {
      const sections = [
        { value: 25 },
        { value: 25, color: '#abcdef' },
        { value: 25 }
      ];

      const wrapper = mount(Donut, { propsData: { sections } });
      const sectionFillerWrappers = wrapper.findAll(el.DONUT_SECTION_FILLER);

      expect(sectionFillerWrappers.at(0).element.style.backgroundColor).toBe(hextToCssRgb(colors[0]));
      expect(sectionFillerWrappers.at(1).element.style.backgroundColor).toBe(hextToCssRgb(sections[1].color));
      expect(sectionFillerWrappers.at(2).element.style.backgroundColor).toBe(hextToCssRgb(colors[1]));
    });

    it('sets the correct title attribute for each section based on the "label" property', () => {
      const sections = [
        { label: 'Section 1 label', value: 25 },
        { label: 'Section 2 label', value: 25 },
        { value: 25 }
      ];

      const wrapper = mount(Donut, { propsData: { sections } });
      const sectionFillerWrappers = wrapper.findAll(el.DONUT_SECTION_FILLER);

      expect(sectionFillerWrappers.at(0).attributes('title')).toBe(sections[0].label);
      expect(sectionFillerWrappers.at(1).attributes('title')).toBe(sections[1].label);
      expect(sectionFillerWrappers.at(2).attributes('title')).toBeFalsy(); // no default title
    });
  });

  describe('"total" prop', () => {
    it('renders the sections differently based on the "total" prop', () => {
      const sections = [{ value: 90 }];
      const wrapper = mount(Donut, { propsData: { sections } });

      let sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      // section is split into 2 elements since it's taking more than half the donut area
      expect(sectionWrappers).toHaveLength(sections.length + 1);

      wrapper.setProps({ total: 200 });

      sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      // section is not split into 2 elements anymore because it's not taking more than half the total value
      expect(sectionWrappers).toHaveLength(sections.length);
    });

    it('throws an error if sum of the section values exceed total', () => {
      const spy = jest.spyOn(global.console, 'error').mockImplementation(() => {});

      const [total, sections] = [50, [{ value: 25 }, { value: 26 }]];

      let errorThrown = false;
      try {
        shallowMount(Donut, { propsData: { total, sections } });
      }
      catch (error) {
        errorThrown = true;
        expect(error.message).toContain('should not exceed');
      }
      finally {
        expect(errorThrown).toBe(true);
        spy.mockRestore();
      }
    });
  });

  describe('"has-legend" prop', () => {
    it('renders the legend with proper legend items', () => {
      const sections = [
        { label: 'Section 1 with value 10', value: 10, color: '#aaaaaa' },
        { label: 'Section 2 with value 20', value: 20, color: '#bbbbbb' },
        { label: 'Section 3 with value 30', value: 30, color: '#cccccc' }
      ];
      const wrapper = shallowMount(Donut, { propsData: { sections, hasLegend: true } });

      const legendItems = wrapper.findAll(el.LEGEND_ITEM);
      const legendItemColors = wrapper.findAll(el.LEGEND_ITEM_COLOR);

      sections.forEach((section, idx) => {
        expect(legendItems.at(idx).text()).toContain(section.label);
        expect(legendItemColors.at(idx).element.style.backgroundColor).toContain(hextToCssRgb(section.color));
      });
    });

    it('renders the legend with default plugged in colors and text if they\'re not provided', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const wrapper = shallowMount(Donut, { propsData: { sections, hasLegend: true } });

      const legendItems = wrapper.findAll(el.LEGEND_ITEM);
      const legendItemColors = wrapper.findAll(el.LEGEND_ITEM_COLOR);

      sections.forEach((_, idx) => {
        expect(legendItems.at(idx).text()).toContain(`Section ${idx + 1}`);
        expect(legendItemColors.at(idx).element.style.backgroundColor).toContain(hextToCssRgb(colors[idx]));
      });
    });

    it('doesn\'t render the legend by default', () => {
      const sections = [{ value: 10 }];
      const wrapper = mount(Donut, { propsData: { sections } });

      const legend = wrapper.find(el.LEGEND);
      const legendItems = wrapper.findAll(el.LEGEND_ITEM);

      expect(legend.exists()).toBe(false);
      expect(legendItems).toHaveLength(0);
    });
  });

  describe('"legend-placement" prop', () => {
    it('renders the legend on the correct side based on the "legend-placement" prop', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const wrapper = shallowMount(Donut, { propsData: { sections, hasLegend: true } });

      const directions = ['top', 'right', 'bottom', 'left'];

      directions.forEach(direction => {
        wrapper.setProps({ legendPlacement: direction });
        expect(wrapper.vm.placementStyles.legend).toEqual(placementStyles[direction].legend);
      });
    });
  });

  describe('"legend" slot', () => {
    it('renders the provided content in "legend" slot instead of the default legend', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const legendHtml = '<p>Custom legend.</p>';
      const wrapper = shallowMount(Donut, {
        propsData: { sections, hasLegend: true },
        slots: { legend: legendHtml }
      });

      expect(wrapper.find(el.LEGEND).exists()).toBe(false);
      expect(wrapper.html()).toContain(legendHtml);
    });
  });

  describe('"sectionHoverClass" prop', () => {
    it('section and legend get sectionHoverClass on section mouseenter', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const wrapper = mount(Donut, { propsData: { sections, hasLegend: true, sectionHoverClass: 'abc' } });

      const sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      const legendWrappers = wrapper.findAll(el.LEGEND_ITEM);

      sections.forEach((section, idx) => {
        sectionWrappers.at(idx).trigger('mouseenter');
        expect(sectionWrappers.at(idx).classes()).toContain('abc');
        expect(legendWrappers.at(idx).classes()).toContain('abc');
      });
    });

    it('no other section or legend get sectionHoverClass on section mouseenter', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const wrapper = mount(Donut, { propsData: { sections, hasLegend: true, sectionHoverClass: 'abc' } });

      const sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      const legendWrappers = wrapper.findAll(el.LEGEND_ITEM);

      sections.forEach((section, idx) => {
        sectionWrappers.at(idx).trigger('mouseenter');
        sections.forEach((innerSection, index) => {
          if (index !== idx) expect(sectionWrappers.at(index).classes()).not.toContain('abc');
          if (index !== idx) expect(legendWrappers.at(index).classes()).not.toContain('abc');
        });
      });
    });

    it('section and legend get sectionHoverClass removed on section mouseleave', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const wrapper = mount(Donut, { propsData: { sections, hasLegend: true, sectionHoverClass: 'abc' } });

      const sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      const legendWrappers = wrapper.findAll(el.LEGEND_ITEM);

      sections.forEach((section, idx) => {
        sectionWrappers.at(idx).trigger('mouseenter');
        sectionWrappers.at(idx).trigger('mouseleave');
        expect(sectionWrappers.at(idx).classes()).not.toContain('abc');
        expect(legendWrappers.at(idx).classes()).not.toContain('abc');
      });
    });

    it('section and legend get sectionHoverClass on legend mouseenter', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const wrapper = mount(Donut, { propsData: { sections, hasLegend: true, sectionHoverClass: 'abc' } });

      const sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      const legendWrappers = wrapper.findAll(el.LEGEND_ITEM);

      sections.forEach((section, idx) => {
        legendWrappers.at(idx).trigger('mouseenter');
        expect(sectionWrappers.at(idx).classes()).toContain('abc');
        expect(legendWrappers.at(idx).classes()).toContain('abc');
      });
    });

    it('no other section or legend get sectionHoverClass on legend mouseenter', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const wrapper = mount(Donut, { propsData: { sections, hasLegend: true, sectionHoverClass: 'abc' } });

      const sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      const legendWrappers = wrapper.findAll(el.LEGEND_ITEM);

      sections.forEach((section, idx) => {
        legendWrappers.at(idx).trigger('mouseenter');
        sections.forEach((innerSection, index) => {
          if (index !== idx) expect(sectionWrappers.at(index).classes()).not.toContain('abc');
          if (index !== idx) expect(legendWrappers.at(index).classes()).not.toContain('abc');
        });
      });
    });

    it('section and legend get sectionHoverClass removed on legend mouseleave', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const wrapper = mount(Donut, { propsData: { sections, hasLegend: true, sectionHoverClass: 'abc' } });

      const sectionWrappers = wrapper.findAll(el.DONUT_SECTION);
      const legendWrappers = wrapper.findAll(el.LEGEND_ITEM);

      sections.forEach((section, idx) => {
        legendWrappers.at(idx).trigger('mouseenter');
        legendWrappers.at(idx).trigger('mouseleave');
        expect(sectionWrappers.at(idx).classes()).not.toContain('abc');
        expect(legendWrappers.at(idx).classes()).not.toContain('abc');
      });
    });
  });

  describe('"start-angle" prop', () => {
    it('renders the sections with correct "start-angle" offset', () => {
      const sections = [10, 20, 30].map(value => ({ value }));
      const startAngle = 45;

      const wrapper = mount(Donut, { propsData: { sections, startAngle } });
      const sectionsContainerStyles = wrapper.find(el.DONUT_SECTIONS_CONTAINER).element.style;

      expect(sectionsContainerStyles.transform).toBe(`rotate(${startAngle}deg)`);
    });
  });

  describe('"section-click" event', () => {
    it('emits the "section-click" event with correct payload', () => {
      const sections = [
        { name: 'section-1', value: 10 },
        { name: 'section-2', value: 10 },
        { name: 'section-3', value: 10 }
      ];
      const sectionsCopy = [
        { name: 'section-1', value: 10 },
        { name: 'section-2', value: 10 },
        { name: 'section-3', value: 10 }
      ];

      const wrapper = mount(Donut, { propsData: { sections } });
      const sectionWrappers = wrapper.findAll(el.DONUT_SECTION);

      sections.forEach((section, idx) => {
        // click the section
        sectionWrappers.at(idx).trigger('click');
        const sectionClickEvent = wrapper.emitted('section-click');
        const calledWithSection = sectionClickEvent[idx][0];

        // assert that correct number of click events have been emitted
        expect(sectionClickEvent).toHaveLength(idx + 1);
        // assert that the object passed by the user is the one that's returned back and not the internal one
        expect(calledWithSection).toBe(section);
        // and the object hasn't been mutated
        expect(calledWithSection).toStrictEqual(sectionsCopy[idx]);
      });
    });
  });

  describe('font-size recalculation for chart content', () => {
    it('triggers font-size recalculation when the component is mounted', () => {
      const recalcFontSize = jest.fn();
      shallowMount(Donut, { methods: { recalcFontSize } });
      expect(recalcFontSize).toHaveBeenCalledTimes(1);
    });

    it('triggers font-size recalculation when `size` or `unit` props are updated', () => {
      const recalcFontSize = jest.fn();
      const wrapper = shallowMount(Donut, { methods: { recalcFontSize } });

      wrapper.setProps({ size: 210 });
      expect(recalcFontSize).toHaveBeenCalledTimes(2); // called once on mounted

      wrapper.setProps({ unit: '%' });
      expect(recalcFontSize).toHaveBeenCalledTimes(3);
    });

    it('triggers font-size recalculation when the window is resized/zoomed', async () => {
      const wrapper = shallowMount(Donut, { propsData: { size: 50 } });
      const { vm } = wrapper;

      let clientWidth = 250;
      jest.spyOn(vm.donutEl, 'clientWidth', 'get').mockImplementation(() => clientWidth);

      // trigger recalcFontSize so it accesses `clientWidth` this time
      wrapper.setProps({ unit: '%' });
      await vm.$nextTick();

      const oldfontSize = wrapper.vm.fontSize;

      // trigger resize and update the clientWidth
      clientWidth = 350;
      triggerResize();
      await vm.$nextTick();

      const newfontSize = vm.fontSize;

      expect(oldfontSize).not.toEqual(newfontSize);
    });

    it('removes the resize listener from window when the component is destroyed', () => {
      const wrapper = shallowMount(Donut);
      const removeListener = jest.spyOn(window, 'removeEventListener');
      wrapper.destroy();
      expect(removeListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });
  });
});
