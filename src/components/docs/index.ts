/* Every component a doc can use in MDX without importing it. */
import Accordion from "./Accordion.astro";
import Badge from "./Badge.astro";
import Callout from "./Callout.astro";
import Card from "./Card.astro";
import CardGroup from "./CardGroup.astro";
import CodeBlock from "./CodeBlock.astro";
import CodeGroup from "./CodeGroup.astro";
import Frame from "./Frame.astro";
import ParamField from "./ParamField.astro";
import ResponseField from "./ResponseField.astro";
import Step from "./Step.astro";
import Steps from "./Steps.astro";
import Tab from "./Tab.astro";
import Tabs from "./Tabs.astro";
import Video from "./Video.astro";

export const docsComponents = {
  pre: CodeBlock,
  Accordion,
  Badge,
  Callout,
  Card,
  CardGroup,
  CodeGroup,
  Frame,
  ParamField,
  ResponseField,
  Step,
  Steps,
  Tab,
  Tabs,
  Video,
};
