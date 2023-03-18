<script>
  export let label;
  export let value = '';
  export let placeholder = '';
  export let type = 'text';
  export let min;
  export let max;

  function handleChange(event) {
    let newValue = event.target.value;

    if (newValue !== '' && newValue < 0) {
      newValue = 0;
    }

    if (max && newValue > max) {
      newValue = max;
    }

    if (min && newValue < min) {
      newValue = min;
    }

    value = newValue;
  }
</script>

<div>
  <label>{label}</label>
  <input type="{type}" placeholder="{placeholder}" value="{value}" on:input="{handleChange}" min="{min}" max="{max}">
</div>

<style>
  label {
    font-weight: bold;
  }

  input {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
  }
</style>
